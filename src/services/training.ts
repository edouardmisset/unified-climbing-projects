import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { cache } from 'react'
import { createCache } from '~/helpers/cache'
import {
  transformTrainingSessionFromGSToJS,
  transformTrainingSessionFromJSToGS,
} from '~/helpers/transformers/transformers'
import { type TrainingSession, trainingSessionSchema } from '~/schema/training'
import { loadWorksheet } from './google-sheets.ts'

/**
 * Retrieves all training sessions from the Google Sheets 'training' worksheet,
 * transforms them from Google Sheets format to JavaScript object format,
 * and validates them against the trainingSession schema.
 *
 * @returns A promise that resolves to an array of TrainingSessions objects.
 */
const getTrainingSessionsFromDB = cache(
  async (): Promise<TrainingSession[]> => {
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

    const rawTrainingSessions = rows.map((row, index) =>
      Object.assign(transformTrainingSessionFromGSToJS(row.toObject()), {
        id: index,
      }),
    )

    const parsedTrainingSession = trainingSessionSchema
      .array()
      .safeParse(rawTrainingSessions)

    if (!parsedTrainingSession.success) {
      globalThis.console.error(parsedTrainingSession.error)
      return []
    }
    return parsedTrainingSession.data
  },
)

const { getCache, setCache } = createCache<TrainingSession[]>()

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

export async function addTrainingSession(
  trainingSession: Omit<TrainingSession, 'id'>,
): Promise<void> {
  const manualTrainingSessionsSheet = await loadWorksheet('training', {
    edit: true,
  })

  const trainingSessionInGS =
    transformTrainingSessionFromJSToGS(trainingSession)

  try {
    await manualTrainingSessionsSheet.addRow(trainingSessionInGS)
    globalThis.console.log(
      `Training session added successfully (${new Date().getUTCMinutes()}):`,
      trainingSessionInGS,
    )
  } catch (error) {
    globalThis.console.error('Error adding training session:', error)
  }
}
