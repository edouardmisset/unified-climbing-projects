import type { Ascent } from '~/schema/ascent'
import { getAllAscentsFromDB } from './convex.ts'

export async function getAllAscents(): Promise<Ascent[]> {
  return await getAllAscentsFromDB()
}
