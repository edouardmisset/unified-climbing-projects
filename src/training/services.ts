import { cache } from 'react'
import { compareStringsAscending } from '~/shared/helpers/sort-strings'

export { addTrainingSession, getAllTrainingSessions } from '~/shared/services/convex'

/**
 * Get all unique training locations sorted alphabetically
 */
export const getAllTrainingLocations = cache(async (): Promise<string[]> => {
  'use cache'
  const { getAllTrainingSessions } = await import('~/shared/services/convex')
  const allTrainingSessions = await getAllTrainingSessions()

  return [
    ...new Set(
      allTrainingSessions
        .map(({ gymCrag }) => gymCrag?.trim())
        .filter(Boolean)
        .toSorted(compareStringsAscending),
    ),
  ]
})
