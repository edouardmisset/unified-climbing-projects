import { frequency } from '@edouardmisset/array'
import { mapObject } from '@edouardmisset/object'
import { stringEqualsCaseInsensitive } from '@edouardmisset/text'
import { z } from 'zod'
import { convertGradeToNumber } from '~/helpers/converter'
import { findSimilar, groupSimilarStrings } from '~/helpers/find-similar'
import { sortNumericalValues } from '~/helpers/sort-values'
import type { Ascent, Grade } from '~/schema/ascent'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getAllAscents } from '~/services/ascents'

export const cragsRouter = createTRPCRouter({
  getAllCrags: publicProcedure.query(async () => {
    const validCrags = await getValidCrags()

    const sortedCrags = [...new Set(validCrags)].sort()

    return sortedCrags
  }),
  getCragsFrequency: publicProcedure.query(async () => {
    const validCrags = await getValidCrags()

    const sortedCragsByFrequency = sortNumericalValues(
      frequency(validCrags),
      false,
    )

    return sortedCragsByFrequency
  }),
  getMostSuccessfulCrags: publicProcedure
    .input(
      z.object({
        'weight-by-grade': z.boolean().optional(),
      }),
    )
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
          if (!weightedByGrade) cragTotal++
          else {
            const hightestGradeNumber = Math.max(
              ...ascents.map(({ topoGrade }) =>
                convertGradeToNumber(topoGrade),
              ),
            )
            cragTotal +=
              convertGradeToNumber(topoGrade as Grade) / hightestGradeNumber
          }
        }

        weightedByGradeAndSortedCrags[crag] = cragTotal
      }

      const sortedCragsByNumber = sortNumericalValues(
        weightedByGradeAndSortedCrags,
        false,
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
  getDuplicateCrags: publicProcedure.query(async () => {
    const validCrags = await getValidCrags()

    const similarCrags = findSimilar(validCrags)

    return similarCrags
  }),

  getSimilarCrags: publicProcedure.query(async () => {
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