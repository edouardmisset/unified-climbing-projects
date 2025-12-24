import { OUTDOOR, type TrainingSession } from '~/schema/training'
import { countUniqueDates } from './count-unique-dates'

/**
 * Counts the number of unique outdoor climbing days from training sessions
 *
 * @param {TrainingSession[]} trainingSessions - The list of training sessions
 * @returns {number} The count of unique outdoor climbing days
 */
export function countOutdoorDays(trainingSessions: TrainingSession[]): number {
  const outdoorSessions = trainingSessions.filter(
    ({ type }) => type === OUTDOOR,
  )
  return countUniqueDates(outdoorSessions)
}
