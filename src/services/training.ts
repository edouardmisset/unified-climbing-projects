import { compareStringsAscending } from '~/helpers/sort-strings'

export { addTrainingSession, getAllTrainingSessions } from './convex'

/**
 * Get all unique training locations sorted alphabetically
 */
export async function getAllTrainingLocations(): Promise<string[]> {
  const { getAllTrainingSessions } = await import('./convex')
  const allTrainingSessions = await getAllTrainingSessions()

  return [
    ...new Set(
      allTrainingSessions
        .map(({ location }) => location?.trim())
        .filter(Boolean)
        .toSorted(compareStringsAscending),
    ),
  ]
}
