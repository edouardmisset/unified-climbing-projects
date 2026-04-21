import type { TrainingSession } from '~/training/schema'
import { countUniqueDates } from '~/shared/helpers/count-unique-dates'

/**
 * Counts the number of unique outdoor climbing days from training sessions
 *
 * @param {TrainingSession[]} trainingSessions - The list of training sessions
 * @returns {number} The count of unique outdoor climbing days
 */
export function countOutdoorDays(trainingSessions: TrainingSession[]): number {
  const outdoorSessions = trainingSessions.filter(({ sessionType }) => sessionType === 'Out')
  return countUniqueDates(outdoorSessions)
}
