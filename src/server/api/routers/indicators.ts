import { average, isValidNumber } from '@edouardmisset/math'
import z from 'zod'
import { COEFFICIENT_TOP_TEN, COEFFICIENT_VOLUME } from '~/constants/ascents'
import { calculateEfficiencyPercentage } from '~/helpers/calculate-efficiency-percentage'
import {
  calculateProgressionPercentage,
  createHardestGradeMap,
} from '~/helpers/calculate-progression-percentage'
import { calculateTopTenScore } from '~/helpers/calculate-top-ten'
import { calculateVersatilityPercentage } from '~/helpers/calculate-versatility-percentage'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { getAverageGrade } from '~/helpers/get-average-grade'
import { fromGradeToNumber } from '~/helpers/grade-converter'
import { percentSchema } from '~/schema/generic'
import { getAllTrainingSessions } from '~/services/training'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { getFilteredAscents, optionalAscentFilterSchema } from './ascents'

export const indicatorsRouter = createTRPCRouter({
  getVersatilityPercentage: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(percentSchema)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      return calculateVersatilityPercentage(filteredAscents)
    }),
  getEfficiencyPercentage: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(percentSchema)
    .query(async ({ input }) => {
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
      if (
        input?.year === undefined ||
        !isValidNumber(input.year) ||
        input.year <= 0
      ) {
        globalThis.console.log('invalid year', input?.year)
        return 0
      }

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
      const currentFilteredAscents = await getFilteredAscents(input)
      const previousYearFilteredAscents = await getFilteredAscents({
        ...input,
        year: input.year - 1,
      })

      if (currentFilteredAscents.length === 0) {
        globalThis.console.log('no ascents')
        return 0
      }

      const efficiency = calculateEfficiencyPercentage({
        ascents: currentFilteredAscents,
        trainingSessions: filteredTrainingSessions,
      })
      const versatility = calculateVersatilityPercentage(currentFilteredAscents)
      const progression = calculateProgressionPercentage({
        ascents: [...currentFilteredAscents, ...previousYearFilteredAscents],
        year: input?.year,
      })

      const averageGrade = getAverageGrade(currentFilteredAscents)
      const volume =
        fromGradeToNumber(averageGrade === 'N/A' ? '1a' : averageGrade) *
        currentFilteredAscents.length *
        COEFFICIENT_VOLUME

      const averageMaxNumberGrade = average(
        [...createHardestGradeMap(currentFilteredAscents).values()].map(
          fromGradeToNumber,
        ),
      )
      const top =
        calculateTopTenScore(currentFilteredAscents) *
        averageMaxNumberGrade *
        COEFFICIENT_TOP_TEN

      return Math.round(
        volume *
          top *
          (1 + efficiency / 100) *
          (1 + versatility / 100) *
          (1 + progression / 100),
      )
    }),
})
