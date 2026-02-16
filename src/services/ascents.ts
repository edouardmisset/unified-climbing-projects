import { cache } from 'react'

// Re-export from convex service
export { addAscent, getAllAscents } from './convex'

/**
 * Get ascent by ID
 */
export const getAscentById = cache(
  async (_id: string): Promise<import('~/schema/ascent').Ascent | null> => {
    'use cache'
    const { getAllAscents } = await import('./convex')
    const ascents = await getAllAscents()
    return ascents.find(ascent => ascent._id === _id) ?? null
  },
)
