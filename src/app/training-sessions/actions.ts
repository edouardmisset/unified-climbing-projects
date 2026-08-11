'use server'

import { getTrainingSessionById } from '~/services/training'

export async function getTrainingSessionComments(id: string): Promise<string | undefined> {
  return (await getTrainingSessionById(id))?.comments
}
