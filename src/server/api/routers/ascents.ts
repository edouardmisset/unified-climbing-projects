import { isDateInLast12Months, isDateInYear } from '@edouardmisset/date'
import {
  average,
  isValidNumber,
  sum,
  validNumberWithFallback,
} from '@edouardmisset/math'
import { removeAccents } from '@edouardmisset/text'
import fuzzySort from 'fuzzysort'
import { z } from 'zod'
import {
  COEF_ASCENTS_PER_DAY,
  COEF_ASCENT_DAY_PER_DAY_OUTSIDE,
  COEF_NUMBER_OF_CRAGS,
  COEF_ONSIGHT_FLASH_RATIO,
  COEF_TRIES_PER_ASCENT,
  MAX_DISCRETE_HEIGHT_COUNT,
} from '~/constants/ascents'
import { fromAscentToPoints } from '~/helpers/ascent-converter'
import { filterAscents } from '~/helpers/filter-ascents.ts'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { groupSimilarStrings } from '~/helpers/find-similar'
import { fromGradeToNumber } from '~/helpers/grade-converter'
import { minMaxGrades } from '~/helpers/min-max-grades'
import { mostFrequentBy } from '~/helpers/most-frequent-by'
import { sortByDate } from '~/helpers/sort-by-date'
import {
  ASCENT_STYLE,
  type Ascent,
  HOLDS,
  PROFILES,
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
  percentSchema,
  timeframeSchema,
} from '~/schema/generic'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { addAscent, getAllAscents } from '~/services/ascents'
import { getAllTrainingSessions } from '~/services/training'

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
    year: optionalAscentYear,
    rating: ascentSchema.shape.rating.optional(),
  })
  .optional()
export type OptionalAscentFilter = z.infer<typeof optionalAscentFilterSchema>

export const ascentsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(ascentSchema.array())
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return filteredAscents.sort(sortByDate)
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
        query: z.string().min(1),
        limit: z.string().transform(val => validNumberWithFallback(val, 10)),
      }),
    )
    .output(
      ascentSchema
        .extend(
          z.object({
            highlight: z.string(),
            target: z.string(),
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

      return results.map(result =>
        Object.assign(result.obj, {
          highlight: result.highlight(),
          target: result.target,
        }),
      )
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
    .output(ascentSchema.shape.height)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return mostFrequentBy(filteredAscents, 'height')
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
          year: optionalAscentYear,
        })
        .optional(),
    )
    .output(
      ascentSchema
        .extend(ascentSchema.required({ points: true }).pick({ points: true }))
        .array(),
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
  getVersatilityPercentage: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(percentSchema)
    .query(async ({ input }) => {
      // TODO: extract the logic into a separate function with JSDOC and unit tests
      const filteredAscents = await getFilteredAscents(input)

      const ascentsCount = filteredAscents.length
      if (ascentsCount === 0) return 0

      const holdsRatio =
        new Set(
          filteredAscents
            .map(({ holds }) => holds)
            .filter(hold => hold !== undefined),
        ).size / HOLDS.length

      const heightRatio =
        new Set(
          filteredAscents
            .map(({ height }) => height)
            .filter(height => height !== undefined),
        ).size / MAX_DISCRETE_HEIGHT_COUNT

      const profileRatio =
        new Set(
          filteredAscents
            .map(({ profile }) => profile)
            .filter(profile => profile !== undefined),
        ).size / PROFILES.length

      const styleRatio =
        new Set(filteredAscents.map(({ style }) => style)).size /
        ASCENT_STYLE.length

      const cragRatio =
        new Set(filteredAscents.map(({ crag }) => crag)).size /
        COEF_NUMBER_OF_CRAGS

      const ratios = [
        holdsRatio,
        heightRatio,
        profileRatio,
        styleRatio,
        cragRatio,
      ]

      return average(ratios) * 100
    }),
  getEfficiencyPercentage: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(percentSchema)
    .query(async ({ input }) => {
      // TODO: extract the logic into a separate function with JSDOC and unit tests
      const filteredAscents = await getFilteredAscents(input)

      const allTrainingSessions = await getAllTrainingSessions()
      const filteredTrainingSessions = filterTrainingSessions(
        allTrainingSessions,
        {
          sessionType: 'Out',
          year: input?.year,
          climbingDiscipline: input?.climbingDiscipline,
          gymCrag: input?.crag,
        },
      )

      const ascentsCount = filteredAscents.length
      if (ascentsCount === 0) return 0

      const daysOutside = new Set(
        filteredTrainingSessions.map(({ date }) => date.split('T')[0]),
      ).size
      const ascentDays = new Set(
        filteredAscents.map(({ date }) => date.split('T')[0]),
      ).size
      const ascentDayPerDayOutside =
        (ascentDays / daysOutside) * COEF_ASCENT_DAY_PER_DAY_OUTSIDE

      const ascentsPerDay =
        (filteredAscents.length / daysOutside) * COEF_ASCENTS_PER_DAY

      const averageTries =
        COEF_TRIES_PER_ASCENT /
        average(filteredAscents.map(({ tries }) => tries))

      const onsightFlashRatio =
        (filterAscents(filteredAscents, { style: 'Flash' }).length +
          filterAscents(filteredAscents, { style: 'Onsight' }).length /
            ascentsCount) *
        COEF_ONSIGHT_FLASH_RATIO

      return sum(
        ascentDayPerDayOutside,
        ascentsPerDay,
        averageTries,
        onsightFlashRatio,
      )
    }),
  getProgressionPercentage: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(percentSchema)
    .query(async ({ input }) => {
      if (
        input?.year === undefined ||
        !isValidNumber(input.year) ||
        input.year <= 0
      ) {
        globalThis.console.log('invalid year', input?.year)
        return 0
      }

      const filteredAscents = await getFilteredAscents(input)

      if (filteredAscents.length === 0) {
        globalThis.console.log('no ascents')
        return 0
      }

      const currentYear = input.year

      console.time('Progression Slow')
      calculateProgressionPercentageSlow({
        ascents: filteredAscents,
        year: currentYear,
      })
      console.timeEnd('Progression Slow')

      console.time('Progression fast')
      const progression = calculateProgressionPercentage({
        ascents: filteredAscents,
        year: currentYear,
      })
      console.timeEnd('Progression fast')

      return progression
    }),
})

// TODO: benchmark the two functions, write unit tests and JSDOC
function calculateProgressionPercentage({
  ascents,
  year,
}: { ascents: Ascent[]; year: number }): number {
  const previousYear = year - 1

  // Define our categories to check
  const categories = [
    { climbingDiscipline: 'Boulder', style: 'Redpoint' },
    { climbingDiscipline: 'Boulder', style: 'Flash' },
    { climbingDiscipline: 'Route', style: 'Redpoint' },
    { climbingDiscipline: 'Route', style: 'Flash' },
    { climbingDiscipline: 'Route', style: 'Onsight' },
  ] as const satisfies Pick<Ascent, 'climbingDiscipline' | 'style'>[]

  // First, pre-filter ascents to only include relevant years (current and previous)
  const relevantAscents = ascents.filter(ascent => {
    const ascentYear = new Date(ascent.date).getFullYear()
    return ascentYear === year || ascentYear === previousYear
  })

  // Process each category and get the hardest grades for each year
  const progressionResults = categories.map(({ climbingDiscipline, style }) => {
    // Find hardest grade for previous year
    const [, previousYearHardest] = minMaxGrades(
      relevantAscents.filter(
        ascent =>
          new Date(ascent.date).getFullYear() === previousYear &&
          ascent.climbingDiscipline === climbingDiscipline &&
          ascent.style === style,
      ),
    )

    // Find hardest grade for current year
    const [, currentYearHardest] = minMaxGrades(
      relevantAscents.filter(
        ascent =>
          new Date(ascent.date).getFullYear() === year &&
          ascent.climbingDiscipline === climbingDiscipline &&
          ascent.style === style,
      ),
    )

    // Compare grades and return 1 if current year is harder, 0 otherwise
    return fromGradeToNumber(currentYearHardest) >
      fromGradeToNumber(previousYearHardest)
      ? 1
      : 0
  })

  // Calculate average progression score
  return average(progressionResults) * 100
}

function calculateProgressionPercentageSlow({
  ascents,
  year,
}: { ascents: Ascent[]; year: number }): number {
  const previousYear = year - 1

  // Previous year

  const [, previousYearHardestRedpointBoulder] = minMaxGrades(
    filterAscents(ascents, {
      climbingDiscipline: 'Boulder',
      style: 'Redpoint',
      year: previousYear,
    }),
  )
  const [, previousYearHardestFlashBoulder] = minMaxGrades(
    filterAscents(ascents, {
      climbingDiscipline: 'Boulder',
      style: 'Flash',
      year: previousYear,
    }),
  )
  const [, previousYearHardestRedpointRoute] = minMaxGrades(
    filterAscents(ascents, {
      climbingDiscipline: 'Route',
      style: 'Redpoint',
      year: previousYear,
    }),
  )
  const [, previousYearHardestFlashRoute] = minMaxGrades(
    filterAscents(ascents, {
      climbingDiscipline: 'Route',
      style: 'Flash',
      year: previousYear,
    }),
  )
  const [, previousYearHardestOnsightRoute] = minMaxGrades(
    filterAscents(ascents, {
      climbingDiscipline: 'Route',
      style: 'Onsight',
      year: previousYear,
    }),
  )

  // Current year

  const [, currentYearHardestRedpointBoulder] = minMaxGrades(
    filterAscents(ascents, {
      climbingDiscipline: 'Boulder',
      style: 'Redpoint',
      year,
    }),
  )
  const [, currentYearHardestFlashBoulder] = minMaxGrades(
    filterAscents(ascents, {
      climbingDiscipline: 'Boulder',
      style: 'Flash',
      year,
    }),
  )
  const [, currentYearHardestRedpointRoute] = minMaxGrades(
    filterAscents(ascents, {
      climbingDiscipline: 'Route',
      style: 'Redpoint',
      year,
    }),
  )
  const [, currentYearHardestFlashRoute] = minMaxGrades(
    filterAscents(ascents, {
      climbingDiscipline: 'Route',
      style: 'Flash',
      year,
    }),
  )
  const [, currentYearHardestOnsightRoute] = minMaxGrades(
    filterAscents(ascents, {
      climbingDiscipline: 'Route',
      style: 'Onsight',
      year,
    }),
  )

  const isHarderRedpointBoulder =
    fromGradeToNumber(currentYearHardestRedpointBoulder) -
      fromGradeToNumber(previousYearHardestRedpointBoulder) >
    0
      ? 1
      : 0
  const isHarderFlashBoulder =
    fromGradeToNumber(currentYearHardestFlashBoulder) -
      fromGradeToNumber(previousYearHardestFlashBoulder) >
    0
      ? 1
      : 0
  const isHarderRedpointRoute =
    fromGradeToNumber(currentYearHardestRedpointRoute) -
      fromGradeToNumber(previousYearHardestRedpointRoute) >
    0
      ? 1
      : 0
  const isHarderFlashRoute =
    fromGradeToNumber(currentYearHardestFlashRoute) -
      fromGradeToNumber(previousYearHardestFlashRoute) >
    0
      ? 1
      : 0
  const isHarderOnsightRoute =
    fromGradeToNumber(currentYearHardestOnsightRoute) -
      fromGradeToNumber(previousYearHardestOnsightRoute) >
    0
      ? 1
      : 0

  const harder = [
    isHarderRedpointBoulder,
    isHarderFlashBoulder,
    isHarderRedpointRoute,
    isHarderFlashRoute,
    isHarderOnsightRoute,
  ]

  return average(harder) * 100
}
