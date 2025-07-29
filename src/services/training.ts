import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { cache } from 'react'
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
 * Uses React's cache() for per-request caching and global cache for cross-request persistence
 *
 * @returns A promise that resolves to an array of TrainingSessions objects.
 */
const getTrainingSessionsFromDB = cache(
  async (): Promise<TrainingSession[]> => {
    globalThis.console.log(
      '🔄 Fetching training sessions from Google Sheets...',
    )
    const startTime = Date.now()

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

    const trainingSessions = parsedTrainingSession.data

    const duration = Date.now() - startTime
    globalThis.console.log(
      `✅ Fetched ${trainingSessions.length} training sessions in ${duration}ms`,
    )

    return trainingSessions
  },
)

export async function getAllTrainingSessions(): Promise<TrainingSession[]> {
  return await getTrainingSessionsFromDB()
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

    // Note: React's cache() will automatically handle cache invalidation per-request
    // For immediate updates, consider using revalidation strategies or optimistic updates
  } catch (error) {
    globalThis.console.error('Error adding training session:', error)
    throw error
  }
}
