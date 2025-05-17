import { frequency } from '@edouardmisset/array/count-by.ts'
import { z } from 'zod'
import { findSimilar, groupSimilarStrings } from '~/helpers/find-similar'
import {
  compareStringsAscending,
  compareStringsDescending,
} from '~/helpers/sort-strings'
import { sortNumericalValues } from '~/helpers/sort-values'
import { type Ascent, ascentSchema } from '~/schema/ascent'
import { positiveInteger } from '~/schema/generic'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getAllAscents } from '~/services/ascents'

async function getAllAreas(): Promise<NonNullable<Ascent['area']>[]> {
  const ascents = await getAllAscents()
  return ascents.map(({ area }) => area?.trim()).filter(Boolean)
}

export const areasRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          sortOrder: z.enum(['asc', 'desc', 'newest', 'oldest']).optional(),
        })
        .optional(),
    )
    .output(ascentSchema.shape.area.nonoptional().array())
    .query(async ({ input }) => {
      const { sortOrder } = input ?? {}
      const validAreas = await getAllAreas()
      const uniqueAreas = [...new Set(validAreas)]

      if (sortOrder === 'asc')
        return uniqueAreas.sort((a, b) => compareStringsAscending(a, b))
      if (sortOrder === 'desc')
        return uniqueAreas.sort((a, b) => compareStringsDescending(a, b))
      if (sortOrder === 'newest') return uniqueAreas
      if (sortOrder === 'oldest') return uniqueAreas.reverse()

      return uniqueAreas
    }),
  getFrequency: publicProcedure
    .output(
      z.record(
        ascentSchema.required({ area: true }).shape.area,
        positiveInteger,
      ),
    )
    .query(async () => {
      const sortedAreasByFrequency = sortNumericalValues(
        frequency(await getAllAreas()),
        {
          ascending: false,
        },
      )
      return sortedAreasByFrequency
    }),
  getDuplicates: publicProcedure
    .output(
      z
        .record(
          ascentSchema.required({ area: true }).shape.area,
          z.string().array(),
        )
        .array(),
    )
    .query(async () => {
      const duplicateAreas = findSimilar(await getAllAreas())

      return duplicateAreas
    }),
  getSimilar: publicProcedure
    .output(z.tuple([z.string(), z.string().array()]).array())
    .query(async () => {
      const similarAreas = Array.from(
        groupSimilarStrings(await getAllAreas(), 3).entries(),
      )

      return similarAreas
    }),
})
