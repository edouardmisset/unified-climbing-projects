import { createCache } from '~/helpers/cache'
import {
  transformAscentFromGSToJS,
  transformAscentFromJSToGS,
} from '~/helpers/transformers'
import { type Ascent, ascentSchema } from '~/schema/ascent'
import { loadWorksheet } from './google-sheets'

/**
 * Retrieves all ascent records from the Google Sheets 'ascents' worksheet,
 * transforms them from Google Sheets format to JavaScript object format,
 * and validates them against the ascent schema.
 *
 * @returns A promise that resolves to an array of Ascent objects, each
 * representing a validated ascent record.
 */
export async function getAscentsFromDB(): Promise<Ascent[]> {
  const allAscentsSheet = await loadWorksheet('ascents')
  const rows = await allAscentsSheet.getRows()

  const rawAscents = rows.map(row => transformAscentFromGSToJS(row.toObject()))

  return ascentSchema.array().parse(rawAscents)
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

export async function addAscent(ascent: Ascent): Promise<void> {
  const manualAscentsSheet = await loadWorksheet('ascents', { edit: true })

  await manualAscentsSheet.addRow(transformAscentFromJSToGS(ascent))
}
