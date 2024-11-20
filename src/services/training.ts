import { createCache } from '~/helpers/cache'
import { TRANSFORMED_TRAINING_HEADER_NAMES } from '~/helpers/transformers'
import {
  fetchAndParseCSV,
  replaceHeaders,
  transformClimbingData,
} from '~/scripts/import-training-and-ascent-data-from-gs'
import { type TrainingSession, trainingSessionSchema } from '~/types/training'
import { SHEETS_INFO } from './google-sheets'

const { getCache, setCache } = createCache<TrainingSession[]>()

export async function getAllTrainingSessions(): Promise<TrainingSession[]> {
  const cachedData = getCache()
  if (cachedData !== undefined) {
    return cachedData
  }

  // Fetch CSV data
  const { data, headers } = await fetchAndParseCSV(
    SHEETS_INFO.training.csvExportURL,
  )
  // Transform CSV data into Array of Training Sessions
  const transformedHeaders = replaceHeaders(
    headers,
    TRANSFORMED_TRAINING_HEADER_NAMES,
  )

  const transformedClimbingData = transformClimbingData(
    data,
    transformedHeaders,
  )

  try {
    const parsedData = trainingSessionSchema
      .array()
      .parse(transformedClimbingData)
    // Cache the transformed data
    setCache(parsedData)
    return parsedData
  } catch (error) {
    throw new Error('The data could not be parsed', error as Error)
  }
}
