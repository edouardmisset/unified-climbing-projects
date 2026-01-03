import { isValidNumber } from '@edouardmisset/math'
import { calculateEfficiencyPercentage } from '~/helpers/calculate-efficiency-percentage'
import { calculateProgressionPercentage } from '~/helpers/calculate-progression-percentage'
import { calculateScore } from '~/helpers/calculate-score'
import { calculateVersatilityPercentage } from '~/helpers/calculate-versatility-percentage'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { z } from '~/helpers/zod'
import { percentSchema } from '~/schema/generic'
import { OUTDOOR } from '~/schema/training'
import { getAllTrainingSessions } from '~/services/training'
import { optionalAscentFilterSchema } from '~/types/optional-ascent-filter'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { getFilteredAscents } from './ascents'

export const indicatorsRouter = createTRPCRouter({
  getEfficiencyPercentage: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(percentSchema)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      const allTrainingSessions = await getAllTrainingSessions()
      const filteredTrainingSessions = filterTrainingSessions(
        allTrainingSessions,
        {
          discipline: input?.discipline,
          location: input?.crag,
          type: OUTDOOR,
          year: input?.year,
        },
      )

      return calculateEfficiencyPercentage({
        ascents: filteredAscents,
        trainingSessions: filteredTrainingSessions,
      })
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

      const currentFilteredAscents = await getFilteredAscents(input)
      const previousYearFilteredAscents = await getFilteredAscents({
        ...input,
        year: input.year - 1,
      })

      if (currentFilteredAscents.length === 0) {
        globalThis.console.log('no ascents')
        return 0
      }

      return calculateProgressionPercentage({
        ascents: [...currentFilteredAscents, ...previousYearFilteredAscents],
        year: input.year,
      })
    }),
  getScore: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(z.number().int().min(0))
    .query(async ({ input }) => {
      const { year } = input ?? {}
      if (year === undefined || !isValidNumber(year) || year <= 0) {
        globalThis.console.error('invalid year', year)
        return 0
      }

      const allTrainingSessions = await getAllTrainingSessions()
      const filteredTrainingSessions = filterTrainingSessions(
        allTrainingSessions,
        {
          discipline: input?.discipline,
          location: input?.crag,
          type: OUTDOOR,
          year,
        },
      )
      const filteredAscents = await getFilteredAscents(input)

      return calculateScore({
        ascents: filteredAscents,
        trainingSessions: filteredTrainingSessions,
        year,
      })
    }),
  getVersatilityPercentage: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(percentSchema)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return calculateVersatilityPercentage(filteredAscents)
    }),
})
