import { frequency } from '@edouardmisset/array/count-by.ts'
import { z } from 'zod'
import { findSimilar, groupSimilarStrings } from '~/helpers/find-similar'
import { compareStringsAscending } from '~/helpers/sort-strings'
import { sortNumericalValues } from '~/helpers/sort-values'

import type { Ascent } from '~/schema/ascent'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getAllAscents } from '~/services/ascents'

async function getAllAreas(): Promise<NonNullable<Ascent['area']>[]> {
  const ascents = await getAllAscents()
  return ascents.map(({ area }) => area?.trim()).filter(Boolean)
}

// Get all known areas from the ascents
export const areasRouter = createTRPCRouter({
  // Get all known areas
  getAll: publicProcedure.output(z.string().array()).query(async () => {
    const validAreas = await getAllAreas()
    const sortedAreas = [...new Set(validAreas)].sort((a, b) =>
      compareStringsAscending(a, b),
    )

    return sortedAreas
  }),
  // Get all known areas sorted by frequency
  getFrequency: publicProcedure.output(z.record(z.number())).query(async () => {
    const sortedAreasByFrequency = sortNumericalValues(
      frequency(await getAllAreas()),
      {
        ascending: false,
      },
    )
    return sortedAreasByFrequency
  }),
  // Get all known areas that are similar
  getDuplicates: publicProcedure
    .output(z.record(z.string().array()).array())
    .query(async () => {
      const duplicateAreas = findSimilar(await getAllAreas())

      return duplicateAreas
    }),
  // Get all known areas that are similar
  getSimilar: publicProcedure
    .output(z.tuple([z.string(), z.string().array()]).array())
    .query(async () => {
      const similarAreas = Array.from(
        groupSimilarStrings(await getAllAreas(), 3).entries(),
      )

      return similarAreas
    }),
})
