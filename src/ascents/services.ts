import { cache } from 'react'
import type { Ascent } from '~/ascents/schema'

/**
 * Get ascent by ID
 */
export const getAscentById = cache(async (_id: string): Promise<Ascent | undefined> => {
  'use cache'
  const { getAllAscents } = await import('~/shared/services/convex')
  const ascents = await getAllAscents()
  return ascents.find(ascent => ascent._id === _id) ?? undefined
})

export { addAscent, getAllAscents } from '~/shared/services/convex'
