import { frequency } from '@edouardmisset/array'
import { average } from '@edouardmisset/math/average.ts'

import { z } from 'zod'
import {
  convertGradeToNumber,
  convertNumberToGrade,
} from '~/helpers/converters'
import {
  type Ascent,
  type Grade,
  ascentSchema,
  parseISODateToTemporal,
} from '~/schema/ascent'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getAllAscents } from '~/services/ascents'

async function getFilteredAscents({
  climbingDiscipline,
  year,
  style,
}: {
  climbingDiscipline?: Ascent['climbingDiscipline']
  year?: number
  style?: Ascent['style']
} = {}): Promise<Ascent[]> {
  const ascents = await getAllAscents()

  return ascents.filter(
    ascent =>
      (climbingDiscipline === undefined ||
        ascent.climbingDiscipline === climbingDiscipline) &&
      (year === undefined ||
        parseISODateToTemporal(ascent.date).year === year) &&
      (style === undefined || ascent.style === style),
  )
}

export const gradesRouter = createTRPCRouter({
  getAllGrades: publicProcedure
    .input(
      z
        .object({
          'climbing-discipline':
            ascentSchema.shape.climbingDiscipline.optional(),
          year: z.number().optional(),
          style: ascentSchema.shape.style.optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const {
        'climbing-discipline': climbingDiscipline,
        year,
        style,
      } = input ?? {}

      const filteredGrades = (
        await getFilteredAscents({ climbingDiscipline, year, style })
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
          style: ascentSchema.shape.style.optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const {
        'climbing-discipline': climbingDiscipline,
        year,
        style,
      } = input ?? {}

      const filteredGrades = (
        await getFilteredAscents({ climbingDiscipline, year, style })
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
          style: ascentSchema.shape.style.optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const {
        'climbing-discipline': climbingDiscipline,
        year,
        style,
      } = input ?? {}

      const filteredNumberGrades = (
        await getFilteredAscents({ climbingDiscipline, year, style })
      ).map(({ topoGrade }) => convertGradeToNumber(topoGrade as Grade))

      return convertNumberToGrade(Math.round(average(filteredNumberGrades)))
    }),
})
