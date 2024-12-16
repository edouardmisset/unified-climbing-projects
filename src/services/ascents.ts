import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { createCache } from '~/helpers/cache'
import {
  transformAscentFromGSToJS,
  transformAscentFromJSToGS,
} from '~/helpers/transformers/transformers'
import { type Ascent, ascentSchema } from '~/schema/ascent'
import { loadWorksheet } from './google-sheets.ts'

/**
 * Retrieves all ascent records from the Google Sheets 'ascents' worksheet,
 * transforms them from Google Sheets format to JavaScript object format,
 * and validates them against the ascent schema.
 *
 * @returns A promise that resolves to an array of Ascent objects, each
 * representing a validated ascent record.
 */
export async function getAscentsFromDB(): Promise<Ascent[]> {
  let rows:
    | undefined
    | Awaited<ReturnType<GoogleSpreadsheetWorksheet['getRows']>>

  try {
    const allAscentsSheet = await loadWorksheet('ascents')
    rows = await allAscentsSheet.getRows()
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    globalThis.console.error(error)
  }

  if (rows === undefined) return []

  const rawAscents = rows.map((row, index) => ({
    ...transformAscentFromGSToJS(row.toObject()),
    id: index,
  }))

  const parsedAscents = ascentSchema.array().safeParse(rawAscents)

  if (!parsedAscents.success) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    globalThis.console.error(parsedAscents.error)
    return []
  }
  return parsedAscents.data
}

const { getCache, setCache } = createCache<Ascent[]>()

export async function getAllAscents(options?: { refresh?: boolean }): Promise<
  Ascent[]
> {
  const cachedData = getCache()

  if (options?.refresh === true || cachedData === undefined) {
    const ascents = await getAscentsFromDB()
    setCache(ascents)
    return ascents
  }

  return cachedData
}

export async function addAscent(ascent: Omit<Ascent, 'id'>): Promise<void> {
  const manualAscentsSheet = await loadWorksheet('ascents', { edit: true })

  await manualAscentsSheet.addRow(transformAscentFromJSToGS(ascent))
}
