import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { cache } from 'react'
import { sortByDate } from '~/helpers/sort-by-date.ts'
import {
  transformAscentFromGSToJS,
  transformAscentFromJSToGS,
} from '~/helpers/transformers/transformers'
import { type Ascent, ascentSchema } from '~/schema/ascent'
import { getAllAscentsFromDB } from './convex.ts'
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
const _getAscentsFromGS = cache(async (): Promise<Ascent[]> => {
  'use cache'

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
    Object.assign(transformAscentFromGSToJS(row.toObject()), {
      _id: String(index + 1),
    }),
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

  return sortedAscents
})

export async function getAllAscents(): Promise<Ascent[]> {
  return await getAllAscentsFromDB()
}

async function _addAscentToGS(ascent: Omit<Ascent, '_id'>): Promise<void> {
  const manualAscentsSheet = await loadWorksheet('ascents', { edit: true })

  const ascentInGS = transformAscentFromJSToGS(ascent)

  try {
    await manualAscentsSheet.addRow(ascentInGS)
    globalThis.console.log(
      `Ascent added to Google Sheets successfully (${new Date().getUTCMinutes()}):`,
      ascentInGS,
    )
  } catch (error) {
    globalThis.console.error('Error adding ascent to Google Sheets:', error)
    throw error
  }
}
