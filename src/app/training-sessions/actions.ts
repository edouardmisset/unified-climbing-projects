'use server'

import { getTrainingSessionById } from '~/services/training'

export async function getTrainingSessionComments(id: string): Promise<string> {
  const trainingSession = await getTrainingSessionById(id)
  return trainingSession?.comments ?? ''
}
