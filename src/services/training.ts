import type { TrainingSession } from '~/schema/training'
import {
  getAllTrainingSessionsFromDB,
  getTrainingYearsFromDB,
} from './convex.ts'

export async function getAllTrainingSessions(): Promise<TrainingSession[]> {
  return await getAllTrainingSessionsFromDB()
}

export async function getTrainingYears(): Promise<number[]> {
  return await getTrainingYearsFromDB()
}
