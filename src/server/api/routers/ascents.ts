import { sortBy } from '@edouardmisset/array'
import { average, validNumberWithFallback } from '@edouardmisset/math'
import { removeAccents } from '@edouardmisset/text'

import fuzzySort from 'fuzzysort'
import { boolean, number, string, z } from 'zod'
import { filterAscents } from '~/helpers/filter-ascents.ts'
import { groupSimilarStrings } from '~/helpers/find-similar'
import {
  type Ascent,
  ascentSchema,
  ascentStyleSchema,
  climbingDisciplineSchema,
  gradeSchema,
  holdsSchema,
  parseISODateToTemporal,
  profileSchema,
} from '~/schema/ascent'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { addAscent, getAllAscents } from '~/services/ascents'
import { getFilteredAscents, optionalAscentInputSchema } from './grades.ts'

export const ascentsRouter = createTRPCRouter({
  getAllAscents: publicProcedure
    .input(
      z
        .object({
          'topo-grade': gradeSchema.optional(),
          climbingDiscipline: climbingDisciplineSchema.optional(),
          crag: ascentSchema.shape.crag.optional(),
          descending: boolean().optional(),
          sort: string().optional(),
          style: ascentStyleSchema.optional(),
          tries: ascentSchema.shape.tries.optional(),
          year: number().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const {
        'topo-grade': gradeFilter,
        year: yearFilter,
        tries: numberOfTriesFilter,
        crag: cragFilter,
        descending: dateIsDescending,
        climbingDiscipline: disciplineFilter,
        sort,
        style: styleFilter,
      } = input ?? {}

      const transformFields = (
        fields: string | undefined,
      ): (keyof Ascent)[] | undefined =>
        fields === undefined
          ? undefined
          : (fields.split(',').reverse() as (keyof Ascent)[])

      const sortFields = transformFields(sort)

      const ascents = await getAllAscents()
      const filteredAscents = filterAscents(ascents, {
        grade: gradeFilter,
        year: yearFilter,
        tries: numberOfTriesFilter,
        crag: cragFilter,
        climbingDiscipline: disciplineFilter,
        style: styleFilter,
      })

      const dateSortedAscents = filteredAscents.sort(
        ({ date: leftDate }, { date: rightDate }) =>
          leftDate === rightDate
            ? 0
            : parseISODateToTemporal(leftDate).until(
                parseISODateToTemporal(rightDate),
              ).sign *
              -1 *
              (dateIsDescending ? -1 : 1),
      )
      const sortedAscents =
        sortFields === undefined
          ? dateSortedAscents
          : sortFields.reduce((previouslySortedAscents, sortField) => {
              const ascending = !sortField.startsWith('-')
              const field = ascending
                ? sortField
                : (sortField.slice(1) as keyof Ascent)

              return sortBy(previouslySortedAscents, field, ascending)
            }, dateSortedAscents)

      return sortedAscents
    }),
  getDuplicates: publicProcedure.query(async () => {
    const ascentMap = new Map<string, number>()
    const ascents = await getAllAscents()

    for (const ascent of ascents) {
      const { routeName, crag, topoGrade } = ascent as {
        routeName: string
        crag: string
        topoGrade: string
      }
      // We ignore the "+" in the topoGrade in case it was logged inconsistently
      const key = [routeName, topoGrade.replace('+', ''), crag]
        .map(string => removeAccents(string.toLocaleLowerCase()))
        .join('-')

      ascentMap.set(key, (ascentMap.get(key) || 0) + 1)
    }

    const duplicateAscents = Array.from(ascentMap.entries())
      .filter(([, count]) => count > 1)
      .map(([key]) => key)

    return duplicateAscents
  }),
  getSimilar: publicProcedure.query(async () => {
    const ascents = await getAllAscents()
    const similarAscents = Array.from(
      groupSimilarStrings(
        ascents.map(({ routeName }) => routeName),
        2,
      ).entries(),
    )

    return similarAscents
  }),
  search: publicProcedure
    .input(
      z.object({
        query: string(),
        limit: z
          .string()
          .optional()
          .transform(val => validNumberWithFallback(val, 100)),
      }),
    )
    .query(async ({ input }) => {
      const { query, limit } = input

      const results = fuzzySort.go(
        removeAccents(query),
        await getAllAscents(),
        {
          key: ({ routeName }) => routeName,
          limit,
          threshold: 0.7,
        },
      )

      return results.map(result => ({
        highlight: result.highlight(),
        target: result.target,
        ...result.obj,
      }))
    }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const ascents = await getAllAscents()
      const foundAscent = ascents.find(ascent => ascent.id === input.id)
      if (foundAscent === undefined) {
        return { error: 'Not found' }
      }
      return foundAscent
    }),
  getMostFrequentProfile: publicProcedure
    .input(optionalAscentInputSchema)
    .output(profileSchema)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return mostFrequentBy(filteredAscents, 'profile') ?? 'Vertical'
    }),
  getMostFrequentHold: publicProcedure
    .input(optionalAscentInputSchema)
    .output(holdsSchema)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return mostFrequentBy(filteredAscents, 'holds') ?? 'Crimp'
    }),
  getMostFrequentHeight: publicProcedure
    .input(optionalAscentInputSchema)
    .output(z.number())
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return mostFrequentBy(filteredAscents, 'height') ?? -1
    }),
  getAverageRating: publicProcedure
    .input(optionalAscentInputSchema)
    .output(z.number().min(0))
    .query(async ({ input }) => {
      const filteredRatings = (await getFilteredAscents(input))
        .map(({ rating }) => rating)
        .filter(rating => rating !== undefined)

      return average(filteredRatings) ?? -1
    }),
  getAverageTries: publicProcedure
    .input(optionalAscentInputSchema)
    .output(z.number().min(1))
    .query(async ({ input }) => {
      const filteredTries = (await getFilteredAscents(input)).map(
        ({ tries }) => tries,
      )

      return average(filteredTries) ?? -1
    }),
  addOne: publicProcedure
    .input(ascentSchema.omit({ id: true }))
    .query(async ({ input }) => {
      try {
        addAscent(input)
        return true
      } catch (error) {
        globalThis.console.error(error)
        return false
      }
    }),
})

export function mostFrequentBy<
  Type extends Record<string, unknown>,
  Key extends keyof Type,
>(records: Type[], property: Key): Type[Key] | undefined {
  const map = new Map<Key, number>()
  let mostFrequent: Type[Key] | undefined
  let highestCount = 0

  for (const ascent of records) {
    const { [property]: value } = ascent
    if (value) {
      const count = (map.get(property) ?? 0) + 1
      map.set(property, count)
      if (count > highestCount) {
        highestCount = count
        mostFrequent = value
      }
    }
  }
  return mostFrequent
}
