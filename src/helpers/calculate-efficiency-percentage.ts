import { average, clampValueInRange } from '@edouardmisset/math'
import { COEFFICIENT_ASCENTS_PER_DAY, COEFFICIENT_ONSIGHT_FLASH_RATIO } from '~/constants/ascents'
import type { AscentListProps } from '~/schema/ascent'
import type { TrainingSessionListProps } from '~/schema/training'
import { calculateAscentDayPerDayOutside } from './calculate-ascent-day-per-day-outside'
import { calculateAscentsPerDay } from './calculate-ascents-per-day'
import { calculateAverageTries } from './calculate-average-tries'
import { calculateOnsightFlashRatio } from './calculate-onsight-flash-ratio'
import { countOutdoorDays } from './count-outdoor-days'

/**
 * Calculates the climbing efficiency percentage based on multiple factors
 *
 * The efficiency score combines four metrics:
 * 1. Ratio of ascent days to days spent climbing outside
 * 2. Number of ascents per day outside (with coefficient applied)
 * 3. Average number of tries per ascent
 * 4. Ratio of onsight and flash ascents to total ascents (with coefficient applied)
 *
 * @param {CalculateEfficiencyPercentageParams} params - The input parameters
 * @returns {number} The efficiency percentage (0-100)
 */
export function calculateEfficiencyPercentage({
  ascents,
  trainingSessions,
}: AscentListProps & TrainingSessionListProps): number {
  const ascentsCount = ascents.length
  if (ascentsCount === 0) return 0

  const daysOutside = countOutdoorDays(trainingSessions)
  if (daysOutside === 0) return 0

  const ascentDayPerDayOutside = calculateAscentDayPerDayOutside(ascents, trainingSessions)
  const ascentsPerDay =
    calculateAscentsPerDay(ascents, trainingSessions) * COEFFICIENT_ASCENTS_PER_DAY
  const averageTries = calculateAverageTries(ascents)
  const onsightFlashRatio = calculateOnsightFlashRatio(ascents) * COEFFICIENT_ONSIGHT_FLASH_RATIO

  const percentages = [ascentDayPerDayOutside, ascentsPerDay, averageTries, onsightFlashRatio].map(
    ratio => clampValueInRange({ minimum: 0, maximum: 100, value: ratio * 100 }),
  )

  return Math.round(average(percentages))
}
