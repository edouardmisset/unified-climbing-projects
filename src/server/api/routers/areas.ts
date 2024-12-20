import { frequency } from '@edouardmisset/array'
import { findSimilar, groupSimilarStrings } from '~/helpers/find-similar'
import { sortNumericalValues } from '~/helpers/sort-values'

import type { Ascent } from '~/schema/ascent'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getAllAscents } from '~/services/ascents'

async function getValidAreas(): Promise<NonNullable<Ascent['area']>[]> {
  const ascents = await getAllAscents()
  return ascents
    .map(({ area }) => area?.trim())
    .filter(area => area !== undefined)
}

const validAreas = await getValidAreas()

// Get all known areas from the ascents
export const areasRouter = createTRPCRouter({
  // Get all known areas
  getAllAreas: publicProcedure.query(async () => {
    const validAreas = await getValidAreas()
    const sortedAreas = [...new Set(validAreas)].sort()

    return sortedAreas
  }),
  // Get all known areas sorted by frequency
  getFrequency: publicProcedure.query(() => {
    const sortedAreasByFrequency = sortNumericalValues(frequency(validAreas), {
      ascending: false,
    })
    return sortedAreasByFrequency
  }),
  // Get all known areas that are similar
  getDuplicates: publicProcedure.query(() => {
    const duplicateAreas = findSimilar(validAreas)

    return duplicateAreas
  }),
  // Get all known areas that are similar
  getSimilar: publicProcedure.query(() => {
    const similarAreas = Array.from(
      groupSimilarStrings(validAreas, 3).entries(),
    )

    return similarAreas
  }),
})
