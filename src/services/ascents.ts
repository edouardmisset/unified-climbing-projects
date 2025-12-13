import type { Ascent } from '~/schema/ascent'
import { getAllAscentsFromDB, getAscentYearsFromDB } from './convex.ts'

export async function getAllAscents(): Promise<Ascent[]> {
  return await getAllAscentsFromDB()
}

export async function getAscentYears(): Promise<number[]> {
  return await getAscentYearsFromDB()
}
