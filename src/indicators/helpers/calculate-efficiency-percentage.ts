import { average, clampValueInRange } from '@edouardmisset/math'
import { COEFFICIENT_ASCENTS_PER_DAY, COEFFICIENT_ONSIGHT_FLASH_RATIO } from '~/ascents/constants'
import type { AscentListProps } from '~/ascents/schema'
import type { TrainingSessionListProps } from '~/training/schema'
import { calculateAscentDayPerDayOutside } from '~/ascents/helpers/calculate-ascent-day-per-day-outside'
import { calculateAscentsPerDay } from '~/ascents/helpers/calculate-ascents-per-day'
import { calculateAverageTries } from '~/ascents/helpers/calculate-average-tries'
import { calculateOnsightFlashRatio } from '~/ascents/helpers/calculate-onsight-flash-ratio'
import { countOutdoorDays } from '~/training/helpers/count-outdoor-days'

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
