import { api } from 'convex/_generated/api'
import { fetchAction, fetchQuery } from 'convex/nextjs'
import { EMPTY_OBJECT } from '~/constants/generic'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'

/** ASCENTS */

export async function getAllAscentsFromDB(): Promise<Ascent[]> {
  try {
    return await fetchQuery(api.ascents.get, EMPTY_OBJECT)
  } catch (error) {
    globalThis.console.error('Error fetching ascents from DB:', error)
    return []
  }
}

export async function addAscentToDB(ascent: Omit<Ascent, '_id'>) {
  try {
    await fetchAction(api.ascents.postAction, ascent)
  } catch (error) {
    globalThis.console.error('Error adding ascent to DB:', error)
  }
}

/** TRAINING SESSIONS */

export async function getAllTrainingSessionsFromDB(): Promise<
  TrainingSession[]
> {
  try {
    return await fetchQuery(api.training.get, EMPTY_OBJECT)
  } catch (error) {
    globalThis.console.error('Error fetching training sessions from DB:', error)
    return []
  }
}

export async function addTrainingSessionToDB(
  session: Omit<TrainingSession, '_id'>,
) {
  try {
    await fetchAction(api.training.postAction, session)
  } catch (error) {
    globalThis.console.error('Error adding training session to DB:', error)
  }
}
