import type { Ascent } from '~/ascents/schema'
import type { TrainingSession } from '~/training/schema'
import { countOutdoorDays } from '~/training/helpers/count-outdoor-days'
import { countUniqueDates } from '~/shared/helpers/count-unique-dates'

/**
 * Calculates the ratio of days with ascents relative to days spent outside
 *
 * @param {Ascent[]} ascents - The list of ascents
 * @param {TrainingSession[]} trainingSessions - The list of training sessions
 * @returns {number} Ratio (0-1) of days with ascents to days outside
 */
export function calculateAscentDayPerDayOutside(
  ascents: Ascent[],
  trainingSessions: TrainingSession[],
): number {
  const daysOutside = countOutdoorDays(trainingSessions)
  if (daysOutside === 0) return 0

  const ascentDays = countUniqueDates(ascents)
  return ascentDays / daysOutside
}
