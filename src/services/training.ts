import type { TrainingSession } from '~/schema/training'
import { getAllTrainingSessionsFromDB } from './convex.ts'

export async function getAllTrainingSessions(): Promise<TrainingSession[]> {
  return await getAllTrainingSessionsFromDB()
}
