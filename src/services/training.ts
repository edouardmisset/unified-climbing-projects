import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { createCache } from '~/helpers/cache'
import { transformTrainingSessionFromGSToJS } from '~/helpers/transformers/transformers'
import { type TrainingSession, trainingSessionSchema } from '~/schema/training'
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
  let rows:
    | undefined
    | Awaited<ReturnType<GoogleSpreadsheetWorksheet['getRows']>>

  try {
    const allTrainingSessionsSheet = await loadWorksheet('training')
    rows = await allTrainingSessionsSheet.getRows()
  } catch (error) {
    globalThis.console.error(error)
  }

  if (rows === undefined) return []

  const rawTrainingSessions = rows.map(row =>
    transformTrainingSessionFromGSToJS(row.toObject()),
  )

  const parsedTrainingSession = trainingSessionSchema
    .array()
    .safeParse(rawTrainingSessions)

  if (!parsedTrainingSession.success) {
    globalThis.console.error(parsedTrainingSession.error)
    return []
  }
  return parsedTrainingSession.data
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
