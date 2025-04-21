import { sum } from '@edouardmisset/math'
import {
  COEFFICIENT_ASCENTS_PER_DAY,
  COEFFICIENT_ASCENT_DAY_PER_DAY_OUTSIDE,
  COEFFICIENT_ONSIGHT_FLASH_RATIO,
  COEFFICIENT_TRIES_PER_ASCENT,
} from '~/constants/ascents'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'

type CalculateEfficiencyPercentageParams = {
  /** List of filtered ascents to calculate efficiency for */
  ascents: Ascent[]
  /** List of filtered training sessions (outdoor only) */
  trainingSessions: TrainingSession[]
}

// TODO THIS IS WRONG !!!

/**
 * Calculates the climbing efficiency percentage based on multiple factors
 *
 * The efficiency score combines four metrics:
 * 1. Ratio of ascent days to days spent climbing outside
 * 2. Number of ascents per day
 * 3. Average number of tries per ascent
 * 4. Ratio of onsight and flash ascents to total ascents
 *
 * @param {CalculateEfficiencyPercentageParams} params - The input parameters
 * @returns {number} The efficiency percentage (0-100)
 */
export function calculateEfficiencyPercentage(
  params: CalculateEfficiencyPercentageParams,
): number {
  const { ascents, trainingSessions } = params

  const ascentsCount = ascents.length
  if (ascentsCount === 0) return 0

  // Get unique dates for training sessions (days outside)
  const daysOutsideSet = new Set<string>()
  for (const { date } of trainingSessions) {
    const dateWithoutTime = date.split('T')[0]
    if (dateWithoutTime === undefined) continue

    daysOutsideSet.add(dateWithoutTime)
  }
  const daysOutside = daysOutsideSet.size

  // If there are no days outside, we can't calculate efficiency
  if (daysOutside === 0) return 0

  // Get unique dates for ascents (days with ascents)
  const ascentDaysSet = new Set<string>()

  // Count onsight/flash ascents in the same loop as collecting ascent dates
  let onsightFlashCount = 0
  let totalTries = 0

  for (const { date, style, tries } of ascents) {
    // Add the date
    const dateWithoutTime = date.split('T')[0]
    if (dateWithoutTime === undefined) continue

    ascentDaysSet.add(dateWithoutTime)
    // Count style
    if (style === 'Flash' || style === 'Onsight') {
      onsightFlashCount++
    }

    // Sum tries
    totalTries += tries
  }

  const ascentDays = ascentDaysSet.size

  // Calculate ratio of ascent days to days outside (weighted)
  const ascentDayPerDayOutside =
    (ascentDays / daysOutside) * COEFFICIENT_ASCENT_DAY_PER_DAY_OUTSIDE

  // Calculate average ascents per day (weighted)
  const ascentsPerDay =
    (ascentsCount / daysOutside) * COEFFICIENT_ASCENTS_PER_DAY

  // Calculate average tries factor (weighted)
  // Lower tries = higher efficiency
  const averageTries =
    COEFFICIENT_TRIES_PER_ASCENT / (totalTries / ascentsCount)

  // Calculate ratio of flash/onsight ascents to total ascents (weighted)
  const onsightFlashRatio =
    (onsightFlashCount / ascentsCount) * COEFFICIENT_ONSIGHT_FLASH_RATIO

  // Sum all factors and round to an integer percentage
  return Math.round(
    sum(ascentDayPerDayOutside, ascentsPerDay, averageTries, onsightFlashRatio),
  )
}
