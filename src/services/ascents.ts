import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { cache } from 'react'
import { sortByDate } from '~/helpers/sort-by-date.ts'
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
 * Uses React's cache() for automatic per-request caching
 *
 * @returns A promise that resolves to an array of Ascent objects, each
 * representing a validated ascent record.
 */
const getAscentsFromDB = cache(async (): Promise<Ascent[]> => {
  globalThis.console.log('🔄 Fetching ascents from Google Sheets...')
  const startTime = Date.now()

  let rows:
    | undefined
    | Awaited<ReturnType<GoogleSpreadsheetWorksheet['getRows']>>

  try {
    const allAscentsSheet = await loadWorksheet('ascents')
    rows = await allAscentsSheet.getRows()
  } catch (error) {
    globalThis.console.error(error)
  }

  if (rows === undefined) return []

  const rawAscents = rows.map((row, index) =>
    Object.assign(transformAscentFromGSToJS(row.toObject()), { id: index }),
  )

  const parsedAscents = ascentSchema.array().safeParse(rawAscents)

  if (!parsedAscents.success) {
    globalThis.console.error(parsedAscents.error)
    return []
  }

  const sortedAscents = parsedAscents.data.sort((a, b) =>
    // If the dates are the same, we reverse the order because there is no
    // information about the time of the ascent in the Google Sheets. By
    // default, they are stored chronologically (oldest first), so we need to
    // reverse the order to have the most recent first.
    a.date === b.date ? -1 : sortByDate(a, b, true),
  )

  const duration = Date.now() - startTime
  globalThis.console.log(
    `✅ Fetched ${sortedAscents.length} ascents in ${duration}ms`,
  )

  return sortedAscents
})

export async function getAllAscents(): Promise<Ascent[]> {
  return await getAscentsFromDB()
}

export async function addAscent(ascent: Omit<Ascent, 'id'>): Promise<void> {
  const manualAscentsSheet = await loadWorksheet('ascents', { edit: true })

  await manualAscentsSheet.addRow(transformAscentFromJSToGS(ascent))
}
