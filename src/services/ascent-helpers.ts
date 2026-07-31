import { minMaxGrades } from '~/helpers/min-max-grades'
import { sortByDate } from '~/helpers/sort-by-date'
import type { Ascent, Grade } from '~/schema/ascent'
import { getAllAscents } from './ascents'

/**
 * Get min and max grades from all ascents
 */
export async function getMinMaxGrades(): Promise<[Grade, Grade]> {
  const ascents = await getAllAscents()
  return minMaxGrades(ascents)
}

/**
 * Get all unique crags sorted by most recent usage
 */
export async function getAllCrags(): Promise<string[]> {
  const ascents = await getAllAscents()
  return [
    ...new Set(
      ascents
        .toSorted((a, b) => sortByDate(a, b, true))
        .map(({ crag }) => crag.trim())
        .filter(Boolean),
    ),
  ]
}

/**
 * Get all unique areas sorted by most recent usage
 */
export async function getAllAreas(): Promise<string[]> {
  const ascents = await getAllAscents()
  return [
    ...new Set(
      ascents
        .toSorted((a, b) => sortByDate(a, b, true))
        .map(({ area }) => area?.trim())
        .filter(Boolean),
    ),
  ]
}

/**
 * Get the latest ascent
 */
export async function getLatestAscent(): Promise<Ascent | undefined> {
  const ascents = await getAllAscents()
  if (ascents.length === 0) return
  return ascents.toSorted((a, b) => sortByDate(a, b, true)).at(0)
}
