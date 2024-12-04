import { createCache } from '~/helpers/cache'
import { transformTrainingSessionFromGSToJS } from '~/helpers/transformers/transformers'
import { type TrainingSession, trainingSessionSchema } from '~/types/training'
import { loadWorksheet } from './google-sheets.ts'

const { getCache, setCache } = createCache<TrainingSession[]>()

/**
 * Retrieves all training sessions from the Google Sheets 'training' worksheet,
 * transforms them from Google Sheets format to JavaScript object format,
 * and validates them against the trainingSession schema.
 *
 * @returns A promise that resolves to an array of TrainingSessions objects.
 */
async function getTrainingSessionsFromDB(): Promise<TrainingSession[]> {
  const allTrainingSessionsSheet = await loadWorksheet('training')
  const rows = await allTrainingSessionsSheet.getRows()

  const rawTrainingSessions = rows.map(row => {
    return transformTrainingSessionFromGSToJS(row.toObject())
  })

  return trainingSessionSchema.array().parse(rawTrainingSessions)
}

export async function getAllTrainingSessions(options?: {
  refresh?: boolean
}): Promise<TrainingSession[]> {
  const cachedData = getCache()

  if (options?.refresh === true || cachedData === undefined) {
    const trainingSessions = await getTrainingSessionsFromDB()
    setCache(trainingSessions)
    return trainingSessions
  }

  return cachedData
}
