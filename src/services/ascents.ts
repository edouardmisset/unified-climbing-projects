import type { Ascent } from '~/schema/ascent'

/**
 * Get ascent by ID
 */
export async function getAscentById(_id: string): Promise<Ascent | undefined> {
  const { getAllAscents } = await import('./convex')
  const ascents = await getAllAscents()
  return ascents.find((ascent) => ascent._id === _id) ?? undefined
}

export { addAscent, getAllAscents } from './convex'
