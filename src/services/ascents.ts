import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { cache } from 'react'
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
const getAscentsFromDB = cache(async (): Promise<Ascent[]> => {
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
  return parsedAscents.data
})

const { getCache, setCache } = createCache<Ascent[]>()

export async function getAllAscents(options?: { refresh?: boolean }): Promise<
  Ascent[]
> {
  const { refresh = false } = options ?? {}

  const cachedData = getCache()

  if (refresh || cachedData === undefined) {
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
