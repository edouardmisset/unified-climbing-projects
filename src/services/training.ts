import { cache } from 'react'
import { compareStringsAscending } from '~/helpers/sort-strings'

export { addTrainingSession, getAllTrainingSessions } from './convex'

/**
 * Get all unique training locations sorted alphabetically
 */
export const getAllTrainingLocations = cache(async (): Promise<string[]> => {
  'use cache'
  const { getAllTrainingSessions } = await import('./convex')
  const allTrainingSessions = await getAllTrainingSessions()

  return [
    ...new Set(
      allTrainingSessions
        .map(({ gymCrag }) => gymCrag?.trim())
        .filter(Boolean)
        .sort(compareStringsAscending),
    ),
  ]
})
