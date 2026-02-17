import { cache } from 'react'
import type { Ascent } from '~/schema/ascent'

/**
 * Get ascent by ID
 */
export const getAscentById = cache(async (_id: string): Promise<Ascent | null> => {
  'use cache'
  const { getAllAscents } = await import('./convex')
  const ascents = await getAllAscents()
  return ascents.find(ascent => ascent._id === _id) ?? null
})

export { addAscent, getAllAscents } from './convex'
