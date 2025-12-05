import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { countOutdoorDays } from './count-outdoor-days'
import { countUniqueDates } from './count-unique-dates'

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
