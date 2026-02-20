import { cache } from 'react'
import { minMaxGrades } from '~/helpers/min-max-grades'
import { sortByDate } from '~/helpers/sort-by-date'
import { compareStringsAscending } from '~/helpers/sort-strings'
import type { Ascent, Grade } from '~/schema/ascent'
import { getAllAscents } from './ascents'

/**
 * Get min and max grades from all ascents
 */
export const getMinMaxGrades = cache(async (): Promise<[Grade, Grade]> => {
  'use cache'
  const ascents = await getAllAscents()
  return minMaxGrades(ascents)
})

/**
 * Get all unique crags sorted by most recent usage
 */
export const getAllCrags = cache(async (): Promise<string[]> => {
  'use cache'
  const ascents = await getAllAscents()
  return [
    ...new Set(
      ascents
        .sort((a, b) => sortByDate(a, b, true))
        .map(({ crag }) => crag?.trim())
        .filter(Boolean),
    ),
  ]
})

/**
 * Get all unique areas sorted by most recent usage
 */
export const getAllAreas = cache(async (): Promise<string[]> => {
  'use cache'
  const ascents = await getAllAscents()
  return [
    ...new Set(
      ascents
        .sort((a, b) => sortByDate(a, b, true))
        .map(({ area }) => area?.trim())
        .filter(Boolean),
    ),
  ]
})

/**
 * Get the latest ascent
 */
export const getLatestAscent = cache(async (): Promise<Ascent | undefined> => {
  'use cache'
  const ascents = await getAllAscents()
  if (ascents.length === 0) return
  return ascents.sort((a, b) => sortByDate(a, b, true)).at(0)
})
