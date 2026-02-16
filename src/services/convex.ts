import { fetchAction, fetchQuery } from 'convex/nextjs'
import { cache } from 'react'
import { api } from '~/../convex/_generated/api'
import { EMPTY_OBJECT } from '~/constants/generic'
import { type Ascent, ascentSchema } from '~/schema/ascent'
import { type TrainingSession, trainingSessionSchema } from '~/schema/training'

/** ASCENTS */

export const getAllAscents = cache(async (): Promise<Ascent[]> => {
  'use cache'
  try {
    const ascentData = await fetchQuery(api.ascents.get, EMPTY_OBJECT)

    const parsedAscents = ascentSchema.array().safeParse(ascentData)
    if (!parsedAscents.success) {
      globalThis.console.error(
        'Error parsing ascents from DB:',
        parsedAscents.error,
      )
      return []
    }

    return parsedAscents.data
  } catch (error) {
    globalThis.console.error('Error fetching ascents from DB:', error)
    return []
  }
})

export async function addAscent(ascent: Omit<Ascent, '_id'>): Promise<void> {
  try {
    await fetchAction(api.ascents.postAction, ascent)
  } catch (error) {
    globalThis.console.error('Error adding ascent to DB:', error)
    throw error
  }
}

/** TRAINING SESSIONS */

export const getAllTrainingSessions = cache(
  async (): Promise<TrainingSession[]> => {
    'use cache'
    try {
      const trainingData = await fetchQuery(api.training.get, EMPTY_OBJECT)
      const parsedTraining = trainingSessionSchema
        .array()
        .safeParse(trainingData)
      if (!parsedTraining.success) {
        globalThis.console.error(
          'Error parsing training sessions from DB:',
          parsedTraining.error,
        )
        return []
      }
      return parsedTraining.data
    } catch (error) {
      globalThis.console.error(
        'Error fetching training sessions from DB:',
        error,
      )
      return []
    }
  },
)

export async function addTrainingSession(
  session: Omit<TrainingSession, '_id'>,
): Promise<void> {
  try {
    await fetchAction(api.training.postAction, session)
  } catch (error) {
    globalThis.console.error('Error adding training session to DB:', error)
    throw error
  }
}
