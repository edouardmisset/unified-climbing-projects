import { average, clampValueInRange } from '@edouardmisset/math'
import {
  COEFFICIENT_ASCENTS_PER_DAY,
  COEFFICIENT_ONSIGHT_FLASH_RATIO,
} from '~/constants/ascents'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { extractDateFromISODateString } from './date'

type CalculateEfficiencyPercentageParams = {
  /** List of filtered ascents to calculate efficiency for */
  ascents: Ascent[]
  /** List of filtered training sessions (outdoor only) */
  trainingSessions: TrainingSession[]
}

/**
 * Calculates the climbing efficiency percentage based on multiple factors
 *
 * The efficiency score combines four metrics:
 * 1. Ratio of ascent days to days spent climbing outside
 * 2. Number of ascents per day outside
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
  for (const { date, sessionType } of trainingSessions) {
    const dateAsString = extractDateFromISODateString(date)
    if (dateAsString === undefined || sessionType !== 'Out') continue

    daysOutsideSet.add(dateAsString)
  }
  const daysOutside = daysOutsideSet.size

  if (daysOutside === 0) return 0

  const ascentDaysSet = new Set<string>()

  let onsightFlashCount = 0
  let totalTries = 0

  for (const { date, style, tries } of ascents) {
    const dateAsString = extractDateFromISODateString(date)
    if (dateAsString === undefined) continue

    ascentDaysSet.add(dateAsString)

    if (style === 'Flash' || style === 'Onsight') {
      onsightFlashCount++
    }

    totalTries += tries
  }

  const ascentDayPerDayOutside = ascentDaysSet.size / daysOutside

  const ascentsPerDay =
    (ascentsCount / daysOutside) * COEFFICIENT_ASCENTS_PER_DAY

  const averageTries = ascentsCount / totalTries

  const onsightFlashRatio =
    (onsightFlashCount / ascentsCount) * COEFFICIENT_ONSIGHT_FLASH_RATIO

  const clampedRatios = [
    ascentDayPerDayOutside,
    ascentsPerDay,
    averageTries,
    onsightFlashRatio,
  ].map(ratio =>
    clampValueInRange({ value: ratio * 100, minimum: 0, maximum: 100 }),
  )

  return Math.round(average(clampedRatios))
}
