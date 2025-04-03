import { average } from '@edouardmisset/math/average.ts'
import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import { removeAccents } from '@edouardmisset/text/remove-accents.ts'

import fuzzySort from 'fuzzysort'
import { number, string, z } from 'zod'
import { fromAscentToPoints } from '~/helpers/ascent-converter'
import { filterAscents } from '~/helpers/filter-ascents.ts'
import { groupSimilarStrings } from '~/helpers/find-similar'
import { isDateInLast12Months } from '~/helpers/is-date-in-last-12-months'
import { isDateInYear } from '~/helpers/is-date-in-year'
import {
  type Ascent,
  ascentSchema,
  ascentStyleSchema,
  climbingDisciplineSchema,
  gradeSchema,
  holdsSchema,
  profileSchema,
} from '~/schema/ascent'
import { errorSchema, timeframeSchema } from '~/schema/generic'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { addAscent, getAllAscents } from '~/services/ascents'

export async function getFilteredAscents(
  filters?: OptionalAscentFilter,
): Promise<Ascent[]> {
  const ascents = await getAllAscents()
  if (filters === undefined) return ascents
  return filterAscents(ascents, filters)
}

export const optionalAscentFilterSchema = z
  .object({
    climbingDiscipline: climbingDisciplineSchema.optional(),
    crag: ascentSchema.shape.crag.optional(),
    grade: gradeSchema.optional(),
    height: ascentSchema.shape.height.optional(),
    holds: holdsSchema.optional(),
    profile: profileSchema.optional(),
    style: ascentStyleSchema.optional(),
    tries: ascentSchema.shape.tries.optional(),
    year: number().optional(),
    rating: ascentSchema.shape.rating.optional(),
  })
  .optional()
export type OptionalAscentFilter = z.infer<typeof optionalAscentFilterSchema>

export const ascentsRouter = createTRPCRouter({
  getAllAscents: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(ascentSchema.array())
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return filteredAscents.sort(({ date: leftDate }, { date: rightDate }) => {
        if (leftDate === rightDate) return 0

        return new Date(leftDate) < new Date(rightDate) ? 1 : -1
      })
    }),
  getDuplicates: publicProcedure.output(z.string().array()).query(async () => {
    const ascentMap = new Map<string, number>()
    const ascents = await getAllAscents()

    for (const ascent of ascents) {
      const { routeName, crag, topoGrade } = ascent
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
  getSimilar: publicProcedure
    .output(z.tuple([z.string(), z.string().array()]).array())
    .query(async () => {
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
    .output(
      ascentSchema
        .merge(
          z.object({
            highlight: string(),
            target: string(),
          }),
        )
        .array(),
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
    .output(ascentSchema.or(errorSchema))
    .query(async ({ input }) => {
      const ascents = await getAllAscents()
      const foundAscent = ascents.find(({ id }) => id === input.id)
      if (foundAscent === undefined) {
        return { error: `Ascent ${input.id} not found` }
      }
      return foundAscent
    }),
  getMostFrequentProfile: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(profileSchema)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return mostFrequentBy(filteredAscents, 'profile') ?? 'Vertical'
    }),
  getMostFrequentHold: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(holdsSchema)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return mostFrequentBy(filteredAscents, 'holds') ?? 'Crimp'
    }),
  getMostFrequentHeight: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(z.number())
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return mostFrequentBy(filteredAscents, 'height') ?? -1
    }),
  getAverageRating: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(z.number().min(0))
    .query(async ({ input }) => {
      const filteredRatings = (await getFilteredAscents(input))
        .map(({ rating }) => rating)
        .filter(rating => rating !== undefined)

      return average(filteredRatings) ?? -1
    }),
  getAverageTries: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(z.number().min(1))
    .query(async ({ input }) => {
      const filteredTries = (await getFilteredAscents(input)).map(
        ({ tries }) => tries,
      )

      return average(filteredTries) ?? -1
    }),
  addOne: publicProcedure
    .input(ascentSchema.omit({ id: true }))
    .output(z.boolean())
    .query(async ({ input }) => {
      try {
        await addAscent(input)
        return true
      } catch (error) {
        globalThis.console.error(error)
        return false
      }
    }),
  getTopTen: publicProcedure
    .input(
      z
        .object({
          timeframe: timeframeSchema.optional(),
          year: z.number().int().positive().optional(),
        })
        .optional(),
    )
    .output(ascentSchema.extend({ points: z.number() }).array())
    .query(async ({ input = {} }) => {
      const { timeframe = 'year', year = new Date().getFullYear() } = input

      const allAscents = await getAllAscents()

      const sortedAscentsWithPoints = allAscents
        .filter(({ date }) => {
          if (timeframe === 'all-time') return true
          if (timeframe === 'year') return isDateInYear(date, year)
          if (timeframe === '12-months') return isDateInLast12Months(date)

          return false
        })
        .map(ascent => ({
          ...ascent,
          points: fromAscentToPoints(ascent),
        }))
        .sort((a, b) => b.points - a.points)

      return sortedAscentsWithPoints.slice(0, 10)
    }),
})

function mostFrequentBy<
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
