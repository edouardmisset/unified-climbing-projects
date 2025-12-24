import { average, isValidNumber } from '@edouardmisset/math'
import { COEFFICIENT_TOP_TEN, COEFFICIENT_VOLUME } from '~/constants/ascents'
import type { Ascent } from '~/schema/ascent'
import { OUTDOOR, type TrainingSession } from '~/schema/training'
import { calculateEfficiencyPercentage } from './calculate-efficiency-percentage'
import {
  calculateProgressionPercentage,
  createHardestGradeMap,
} from './calculate-progression-percentage'
import { calculateTopTenScore } from './calculate-top-ten'
import { calculateVersatilityPercentage } from './calculate-versatility-percentage'
import { filterAscents } from './filter-ascents'
import { filterTrainingSessions } from './filter-training'
import { getAverageGrade } from './get-average-grade'
import { fromGradeToNumber } from './grade-converter'

export function calculateScore({
  ascents,
  trainingSessions,
  year,
}: {
  ascents: Ascent[]
  trainingSessions: TrainingSession[]
  year: number
}): number {
  if (!isValidNumber(year) || year <= 0) {
    globalThis.console.error('invalid year', year)
    return 0
  }
  if (ascents.length === 0) {
    globalThis.console.log('no ascents')
    return 0
  }

  // FILTER
  const currentFilteredAscents = filterAscents(ascents)
  const previousYearFilteredAscents = filterAscents(ascents, {
    year: year - 1,
  })
  const outdoorTrainingSession = filterTrainingSessions(trainingSessions, {
    type: OUTDOOR,
    year,
  })

  // CALCULATIONS
  const efficiency = calculateEfficiencyPercentage({
    ascents: currentFilteredAscents,
    trainingSessions: outdoorTrainingSession,
  })
  const versatility = calculateVersatilityPercentage(currentFilteredAscents)
  const progression = calculateProgressionPercentage({
    ascents: [...currentFilteredAscents, ...previousYearFilteredAscents],
    year,
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
}
