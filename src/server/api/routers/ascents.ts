import { isDateInLast12Months, isDateInYear } from '@edouardmisset/date'
import { average, validNumberWithFallback } from '@edouardmisset/math'
import { removeAccents } from '@edouardmisset/text'
import fuzzySort from 'fuzzysort'
import { z } from 'zod'
import { fromAscentToPoints } from '~/helpers/ascent-converter'
import { calculateTopTenScore } from '~/helpers/calculate-top-ten'
import { filterAscents } from '~/helpers/filter-ascents.ts'
import { groupSimilarStrings } from '~/helpers/find-similar'
import { mostFrequentBy } from '~/helpers/most-frequent-by'
import { sortByDate } from '~/helpers/sort-by-date'
import {
  type Ascent,
  ascentSchema,
  ascentStyleSchema,
  climbingDisciplineSchema,
  gradeSchema,
  holdsSchema,
  profileSchema,
} from '~/schema/ascent'
import {
  errorSchema,
  optionalAscentYear,
  timeframeSchema,
} from '~/schema/generic'
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
    rating: ascentSchema.shape.rating.optional(),
    style: ascentStyleSchema.optional(),
    tries: ascentSchema.shape.tries.optional(),
    year: optionalAscentYear,
  })
  .optional()
export type OptionalAscentFilter = z.infer<typeof optionalAscentFilterSchema>

export const ascentsRouter = createTRPCRouter({
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
  calculateTopTen: publicProcedure
    .input(
      z
        .object({
          timeframe: timeframeSchema.optional(),
          year: optionalAscentYear,
        })
        .optional(),
    )
    .output(z.number().int().min(0))
    .query(async ({ input = {} }) => {
      const { timeframe = 'year', year = new Date().getFullYear() } = input

      const allAscents = await getAllAscents()

      const filteredAscents =
        timeframe === 'all-time'
          ? allAscents
          : allAscents.filter(({ date }) => {
              if (timeframe === 'year') return isDateInYear(date, year)
              if (timeframe === 'last-12-months')
                return isDateInLast12Months(date)

              return false
            })

      return calculateTopTenScore(filteredAscents)
    }),
  getAll: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(ascentSchema.array())
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return filteredAscents.sort(sortByDate)
    }),
  getAverageRating: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(ascentSchema.shape.rating)
    .query(async ({ input }) => {
      const filteredRatings = (await getFilteredAscents(input))
        .map(({ rating }) => rating)
        .filter(rating => rating !== undefined)

      return average(filteredRatings) ?? -1
    }),
  getAverageTries: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(ascentSchema.shape.tries)
    .query(async ({ input }) => {
      const filteredTries = (await getFilteredAscents(input)).map(
        ({ tries }) => tries,
      )

      return average(filteredTries) ?? -1
    }),
  getById: publicProcedure
    .input(ascentSchema.pick({ id: true }))
    .output(ascentSchema.or(errorSchema))
    .query(async ({ input }) => {
      const ascents = await getAllAscents()
      const foundAscent = ascents.find(({ id }) => id === input.id)
      if (foundAscent === undefined) {
        return { error: `Ascent ${input.id} not found` }
      }
      return foundAscent
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
  getLatest: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(ascentSchema.or(z.undefined()))
    .query(async ({ input = {} }) => {
      const ascents = await getFilteredAscents(input)
      if (ascents.length === 0) return

      return ascents.sort((a, b) => sortByDate(a, b, true)).at(0)
    }),
  getMostFrequentHeight: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(ascentSchema.shape.height)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return mostFrequentBy(filteredAscents, 'height')
    }),
  getMostFrequentHold: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(holdsSchema)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return mostFrequentBy(filteredAscents, 'holds') ?? 'Crimp'
    }),
  getMostFrequentProfile: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(profileSchema)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return mostFrequentBy(filteredAscents, 'profile') ?? 'Vertical'
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
  getTopTen: publicProcedure
    .input(
      z
        .object({
          timeframe: timeframeSchema.optional(),
          year: optionalAscentYear,
        })
        .optional(),
    )
    .output(
      z.array(
        z.object({
          ...ascentSchema.shape,
          points: ascentSchema.required().shape.points,
        }),
      ),
    )
    .query(async ({ input = {} }) => {
      const { timeframe = 'year', year = new Date().getFullYear() } = input

      const allAscents = await getAllAscents()

      const sortedAscentsWithPoints = allAscents
        .filter(({ date }) => {
          if (timeframe === 'all-time') return true
          if (timeframe === 'year') return isDateInYear(date, year)
          if (timeframe === 'last-12-months') return isDateInLast12Months(date)
          return false
        })
        .map(ascent =>
          Object.assign(ascent, { points: fromAscentToPoints(ascent) }),
        )
        .sort((a, b) => b.points - a.points)

      return sortedAscentsWithPoints.slice(0, 10)
    }),
  search: publicProcedure
    .input(
      z.object({
        limit: z.string().transform(val => validNumberWithFallback(val, 10)),
        query: z.string().min(1),
      }),
    )
    .output(
      z
        .object({
          highlight: z.string(),
          target: z.string(),
          ...ascentSchema.shape,
        })
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

      return results.map(result =>
        Object.assign(result.obj, {
          highlight: result.highlight(),
          target: result.target,
        }),
      )
    }),
})
