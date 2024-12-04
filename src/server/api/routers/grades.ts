import { frequency } from '@edouardmisset/array'
import { average } from '@edouardmisset/math/average.ts'

import { z } from 'zod'
import { convertGradeToNumber, convertNumberToGrade } from '~/helpers/converter'
import { type Ascent, type Grade, ascentSchema } from '~/schema/ascent'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getAllAscents } from '~/services/ascents'

async function getFilteredAscents(
  climbingDiscipline?: Ascent['climbingDiscipline'],
  year?: number,
): Promise<Ascent[]> {
  const ascents = await getAllAscents()

  return ascents
    .filter(ascent =>
      climbingDiscipline === undefined
        ? true
        : ascent.climbingDiscipline === climbingDiscipline,
    )
    .filter(ascent => (year === undefined ? true : ascent.date.year === year))
}

export const gradesRouter = createTRPCRouter({
  getAllGrades: publicProcedure
    .input(
      z
        .object({
          'climbing-discipline':
            ascentSchema.shape.climbingDiscipline.optional(),
          year: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const { 'climbing-discipline': climbingDiscipline, year } = input ?? {}

      const filteredGrades = (
        await getFilteredAscents(climbingDiscipline, year)
      ).map(({ topoGrade }) => topoGrade)

      return [...new Set(filteredGrades)].sort()
    }),
  getFrequency: publicProcedure
    .input(
      z
        .object({
          'climbing-discipline':
            ascentSchema.shape.climbingDiscipline.optional(),
          year: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const { 'climbing-discipline': climbingDiscipline, year } = input ?? {}

      const filteredGrades = (
        await getFilteredAscents(climbingDiscipline, year)
      ).map(({ topoGrade }) => topoGrade)

      const gradeNumberTuple = Object.entries(frequency(filteredGrades)).map(
        ([grade, count]) => [grade, count],
      ) as [Grade, number][]

      return gradeNumberTuple.sort((a, b) => a[0].localeCompare(b[0]))
    }),
  getAverage: publicProcedure
    .input(
      z
        .object({
          'climbing-discipline':
            ascentSchema.shape.climbingDiscipline.optional(),
          year: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const { 'climbing-discipline': climbingDiscipline, year } = input ?? {}

      const filteredNumberGrades = (
        await getFilteredAscents(climbingDiscipline, year)
      ).map(({ topoGrade }) => convertGradeToNumber(topoGrade as Grade))

      return convertNumberToGrade(Math.round(average(filteredNumberGrades)))
    }),
})
