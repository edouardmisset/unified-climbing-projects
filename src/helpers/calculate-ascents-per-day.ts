import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { countOutdoorDays } from './count-outdoor-days'

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
