import { api } from 'convex/_generated/api'
import { fetchMutation } from 'convex/nextjs'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'

export const addAscentToDB = async (ascent: Omit<Ascent, '_id'>) => {
  await fetchMutation(api.ascents.post, ascent)
}

export const addTrainingSessionToDB = async (
  session: Omit<TrainingSession, '_id'>,
) => {
  await fetchMutation(api.training.post, session)
}
