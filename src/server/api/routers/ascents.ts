import { sortBy } from '@edouardmisset/array'
import { validNumberWithFallback } from '@edouardmisset/math'
import { removeAccents, stringEqualsCaseInsensitive } from '@edouardmisset/text'

import fuzzySort from 'fuzzysort'
import { boolean, number, string, z } from 'zod'
import { groupSimilarStrings } from '~/helpers/find-similar'
import { type Ascent, climbingDisciplineSchema } from '~/schema/ascent'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getAllAscents } from '~/services/ascents'

export const ascentsRouter = createTRPCRouter({
  getAllAscents: publicProcedure
    .input(
      z
        .object({
          'topo-grade': string().optional(),
          year: number().optional(),
          tries: number().optional(),
          crag: string().optional(),
          descending: boolean().optional(),
          'climbing-discipline': climbingDisciplineSchema.optional(),
          sort: string().optional(),
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
        'climbing-discipline': disciplineFilter,
        sort,
      } = input ?? {}

      const transformFields = (
        fields: string | undefined,
      ): (keyof Ascent)[] | undefined =>
        fields === undefined
          ? undefined
          : (fields.split(',').reverse() as (keyof Ascent)[])

      const sortFields = transformFields(sort)

      const filters = [
        {
          value: gradeFilter,
          compare: (left: Ascent['topoGrade'], right: Ascent['topoGrade']) =>
            stringEqualsCaseInsensitive(left, right),
          key: 'topoGrade',
        },
        {
          value: numberOfTriesFilter,
          compare: (left: Ascent['tries'], right: Ascent['tries']) =>
            left === right,
          key: 'tries',
        },
        {
          value: disciplineFilter,
          compare: (
            left: Ascent['climbingDiscipline'],
            right: Ascent['climbingDiscipline'],
          ) => left === right,
          key: 'climbingDiscipline',
        },
        {
          value: yearFilter,
          compare: (left: Ascent['date'], right: Ascent['date']) =>
            left.equals(right),
          key: 'date',
        },
        {
          value: cragFilter,
          compare: (a: Ascent['crag'], b: Ascent['crag']) =>
            stringEqualsCaseInsensitive(a, b),
          key: 'crag',
        },
      ]

      const ascents = await getAllAscents()
      const filteredAscents = ascents.filter(ascent =>
        filters.every(
          ({ value, compare, key }) =>
            // @ts-ignore
            value === undefined || compare(ascent[key], value),
        ),
      )

      const dateSortedAscents = filteredAscents.sort(
        ({ date: leftDate }, { date: rightDate }) =>
          leftDate === rightDate
            ? 0
            : leftDate.until(rightDate).sign * -1 * (dateIsDescending ? -1 : 1),
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
})
