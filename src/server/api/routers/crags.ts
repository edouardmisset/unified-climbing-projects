import { frequency } from '@edouardmisset/array/count-by.ts'
import { mapObject } from '@edouardmisset/object/map-object.ts'
import { stringEqualsCaseInsensitive } from '@edouardmisset/text/string-equals.ts'
import { z } from 'zod'
import { findSimilar, groupSimilarStrings } from '~/helpers/find-similar'
import { fromGradeToNumber } from '~/helpers/grade-converter'
import {
  compareStringsAscending,
  compareStringsDescending,
} from '~/helpers/sort-strings'
import { sortNumericalValues } from '~/helpers/sort-values'
import { type Ascent, ascentSchema } from '~/schema/ascent'
import { positiveInteger } from '~/schema/generic'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getAllAscents } from '~/services/ascents'

export const cragsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          sortOrder: z.enum(['asc', 'desc', 'newest', 'oldest']).optional(),
        })
        .optional(),
    )
    .output(ascentSchema.shape.crag.array())
    .query(async ({ input }) => {
      const { sortOrder } = input ?? {}
      const allCrags = await getAllCrags()
      const uniqueCrags = [...new Set(allCrags)]

      if (sortOrder === 'asc')
        return uniqueCrags.sort((a, b) => compareStringsAscending(a, b))
      if (sortOrder === 'desc')
        return uniqueCrags.sort((a, b) => compareStringsDescending(a, b))
      if (sortOrder === 'newest') return uniqueCrags
      if (sortOrder === 'oldest') return uniqueCrags.reverse()

      return uniqueCrags
    }),
  getFrequency: publicProcedure
    .output(z.record(ascentSchema.shape.crag, positiveInteger))
    .query(async () => {
      const validCrags = await getAllCrags()

      return sortNumericalValues(frequency(validCrags), {
        ascending: false,
      })
    }),
  getMostSuccessful: publicProcedure
    .input(
      z.object({
        'weight-by-grade': z.boolean().optional(),
      }),
    )
    .output(z.record(ascentSchema.shape.crag, positiveInteger))
    .query(async ({ input }) => {
      const { 'weight-by-grade': weightedByGrade } = input

      const ascents = await getAllAscents()
      const validCrags = await getAllCrags()
      const uniqueValidCrags = new Set(validCrags)

      const weightedByGradeAndSortedCrags: Record<string, number> = {}

      for (const crag of uniqueValidCrags) {
        const listOfAscentsInCrag = ascents.filter(({ crag: ascentCrag }) =>
          stringEqualsCaseInsensitive(crag, ascentCrag.trim()),
        )

        let cragTotal = 0
        for (const { topoGrade } of listOfAscentsInCrag) {
          if (weightedByGrade) {
            const hightestGradeNumber = Math.max(
              ...ascents.map(({ topoGrade }) => fromGradeToNumber(topoGrade)),
            )
            cragTotal += fromGradeToNumber(topoGrade) / hightestGradeNumber
          } else cragTotal++
        }

        weightedByGradeAndSortedCrags[crag] = cragTotal
      }

      const sortedCragsByNumber = sortNumericalValues(
        weightedByGradeAndSortedCrags,
        { ascending: false },
      )

      const mostSuccessfulCrags: Record<string, number> = Object.fromEntries(
        Object.entries(sortedCragsByNumber)
          .map<[string, number]>(([crag, ascentCount]) => {
            const filteredAscentDates = ascents
              .filter(({ crag: ascentCrag }) =>
                stringEqualsCaseInsensitive(crag, ascentCrag),
              )
              .map(({ date }) => date)
            const daysClimbedInCrag = new Set(filteredAscentDates).size

            return [crag, ascentCount / daysClimbedInCrag]
          })
          .sort(([, a], [, b]) => b - a),
      )

      const highestScore =
        mostSuccessfulCrags[
          Object.keys(
            mostSuccessfulCrags,
          )[0] as keyof typeof mostSuccessfulCrags
        ]

      if (highestScore === undefined) {
        throw new Error('Highest score is undefined')
      }

      return mapObject(mostSuccessfulCrags, val =>
        Number((val / highestScore).toFixed(1)),
      )
    }),
  getDuplicate: publicProcedure
    .output(z.record(ascentSchema.shape.crag, z.string().array()).array())
    .query(async () => {
      const validCrags = await getAllCrags()

      const similarCrags = findSimilar(validCrags)

      return similarCrags
    }),
  getSimilar: publicProcedure
    .output(z.tuple([z.string(), z.string().array()]).array())
    .query(async () => {
      const validCrags = await getAllCrags()
      const similarCrags = Array.from(
        groupSimilarStrings(validCrags, 2).entries(),
      )

      return similarCrags
    }),
})

async function getAllCrags(): Promise<Ascent['crag'][]> {
  const ascents = await getAllAscents()
  return ascents.map(({ crag }) => crag.trim()).filter(Boolean)
}
