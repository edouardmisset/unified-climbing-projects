import { isValidNumber } from '@edouardmisset/math'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { calculateEfficiencyPercentage } from './calculate-efficiency-percentage'
import { calculateProgressionPercentage } from './calculate-progression-percentage'
import { calculateScore } from './calculate-score'
import { calculateVersatilityPercentage } from './calculate-versatility-percentage'
import { filterAscents } from './filter-ascents'
import { filterTrainingSessions } from './filter-training'

export type YearIndicators = {
  efficiency: number
  progression: number
  score: number
  versatility: number
  year: number
}

/**
 * Calculate all indicators for a specific year
 * This function processes all calculations in one pass to avoid re-fetching data
 */
export function getIndicatorsForYear({
  allAscents,
  allTrainingSessions,
  year,
}: {
  allAscents: Ascent[]
  allTrainingSessions: TrainingSession[]
  year: number
}): YearIndicators {
  if (!isValidNumber(year) || year <= 0) {
    return { efficiency: 0, progression: 0, score: 0, versatility: 0, year }
  }

  const currentYearAscents = filterAscents(allAscents, { year })
  const previousYearAscents = filterAscents(allAscents, { year: year - 1 })
  const outdoorTrainingSessions = filterTrainingSessions(allTrainingSessions, {
    sessionType: 'Out',
    year,
  })

  if (currentYearAscents.length === 0) {
    return { efficiency: 0, progression: 0, score: 0, versatility: 0, year }
  }

  const progression = calculateProgressionPercentage({
    ascents: [...currentYearAscents, ...previousYearAscents],
    year,
  })

  const efficiency = calculateEfficiencyPercentage({
    ascents: currentYearAscents,
    trainingSessions: outdoorTrainingSessions,
  })

  const versatility = calculateVersatilityPercentage(currentYearAscents)

  const score = calculateScore({
    ascents: currentYearAscents,
    trainingSessions: outdoorTrainingSessions,
    year,
  })

  return {
    efficiency,
    progression,
    score,
    versatility,
    year,
  }
}
