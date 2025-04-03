import { frequency } from '@edouardmisset/array/count-by.ts'
import { mapObject } from '@edouardmisset/object/map-object.ts'
import { stringEqualsCaseInsensitive } from '@edouardmisset/text/string-equals.ts'
import { z } from 'zod'
import { findSimilar, groupSimilarStrings } from '~/helpers/find-similar'
import { fromGradeToNumber } from '~/helpers/grade-converter'
import { compareStringsAscending } from '~/helpers/sort-strings'
import { sortNumericalValues } from '~/helpers/sort-values'
import type { Ascent } from '~/schema/ascent'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getAllAscents } from '~/services/ascents'

export const cragsRouter = createTRPCRouter({
  getAllCrags: publicProcedure
    .input(
      z
        .object({
          sorted: z.boolean().optional(),
        })
        .optional(),
    )
    .output(z.string().array())
    .query(async ({ input }) => {
      const { sorted = true } = input ?? {}
      const validCrags = await getValidCrags()

      const uniqueCrags = [...new Set(validCrags)]

      return sorted
        ? uniqueCrags.sort((a, b) => compareStringsAscending(a, b))
        : uniqueCrags
    }),
  getFrequency: publicProcedure.output(z.record(z.number())).query(async () => {
    const validCrags = await getValidCrags()

    const sortedCragsByFrequency = sortNumericalValues(frequency(validCrags), {
      ascending: false,
    })

    return sortedCragsByFrequency
  }),
  getMostSuccessfulCrags: publicProcedure
    .input(
      z.object({
        'weight-by-grade': z.boolean().optional(),
      }),
    )
    .output(z.record(z.number()))
    .query(async ({ input }) => {
      const { 'weight-by-grade': weightedByGrade } = input

      const ascents = await getAllAscents()
      const validCrags = await getValidCrags()

      const weightedByGradeAndSortedCrags: Record<string, number> = {}

      for (const crag of new Set(validCrags)) {
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
          .map<[string, number]>(([crag, number]) => {
            const daysClimbedInCrag = new Set(
              ascents
                .filter(({ crag: ascentCrag }) =>
                  stringEqualsCaseInsensitive(crag, ascentCrag),
                )
                .map(({ date }) => date),
            ).size

            return [crag, number / daysClimbedInCrag]
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
    .output(z.record(z.string().array()).array())
    .query(async () => {
      const validCrags = await getValidCrags()

      const similarCrags = findSimilar(validCrags)

      return similarCrags
    }),

  getSimilar: publicProcedure
    .output(z.tuple([z.string(), z.string().array()]).array())
    .query(async () => {
      const validCrags = await getValidCrags()
      const similarCrags = Array.from(
        groupSimilarStrings(validCrags, 2).entries(),
      )

      return similarCrags
    }),
})

async function getValidCrags(): Promise<Ascent['crag'][]> {
  const ascents = await getAllAscents()
  return ascents
    .map(({ crag }) => crag.trim())
    .filter(crag => crag !== undefined)
}
