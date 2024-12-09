import { average } from '@edouardmisset/math/average.ts'

import { number, string, z } from 'zod'
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

const climbingGradeInputSchema = z
  .object({
    'climbing-discipline': ascentSchema.shape.climbingDiscipline.optional(),
    year: number().optional(),
    style: ascentSchema.shape.style.optional(),
  })
  .optional()

export const gradesRouter = createTRPCRouter({
  getAllGrades: publicProcedure
    .input(climbingGradeInputSchema)
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
    .input(climbingGradeInputSchema)
    .output(
      z
        .object({
          grade: ascentSchema.shape.topoGrade,
          Onsight: number(),
          OnsightColor: string(),
          Flash: number(),
          FlashColor: string(),
          Redpoint: number(),
          RedpointColor: string(),
        })
        .array(),
    )
    .query(async ({ input }) => {
      const {
        'climbing-discipline': climbingDiscipline,
        year,
        style,
      } = input ?? {}

      const filteredAscents = await getFilteredAscents({
        climbingDiscipline,
        year,
        style,
      })

      const sortedFilteredGrades = [
        ...new Set(filteredAscents.map(({ topoGrade }) => topoGrade)),
      ].sort()

      const gradeClimbingStylesCount = sortedFilteredGrades.map(grade => {
        const filteredAscentsByGrade = filteredAscents.filter(
          ({ topoGrade }) => topoGrade === grade,
        )

        return {
          grade,
          Onsight: filteredAscentsByGrade.filter(
            ({ style }) => style === 'Onsight',
          ).length,
          OnsightColor: 'var(--green-5)',
          Flash: filteredAscentsByGrade.filter(({ style }) => style === 'Flash')
            .length,
          FlashColor: 'var(--yellow-5)',
          Redpoint: filteredAscentsByGrade.filter(
            ({ style }) => style === 'Redpoint',
          ).length,
          RedpointColor: 'var(--red-5)',
        }
      })

      return gradeClimbingStylesCount as {
        grade: Grade
        Onsight: number
        OnsightColor: string
        Flash: number
        FlashColor: string
        Redpoint: number
        RedpointColor: string
      }[]
    }),
  getAverage: publicProcedure
    .input(climbingGradeInputSchema)
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
