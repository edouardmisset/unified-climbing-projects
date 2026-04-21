import type { Ascent } from '~/ascents/schema'
import type { TrainingSession } from '~/training/schema'
import { countOutdoorDays } from '~/training/helpers/count-outdoor-days'

/**
 * Calculates the average number of ascents per day outside
 *
 * @param {Ascent[]} ascents - The list of ascents
 * @param {TrainingSession[]} trainingSessions - The list of training sessions
 * @returns {number} Average ascents per day
 */
export function calculateAscentsPerDay(
  ascents: Ascent[],
  trainingSessions: TrainingSession[],
): number {
  const daysOutside = countOutdoorDays(trainingSessions)
  if (daysOutside === 0) return 0

  return ascents.length / daysOutside
}
