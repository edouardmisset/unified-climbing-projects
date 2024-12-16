import { average } from '@edouardmisset/math/average.ts'

import { number, string, z } from 'zod'
import { fromGradeToNumber, fromNumberToGrade } from '~/helpers/converters'
import { type Grade, _GRADES, ascentSchema, gradeSchema } from '~/schema/ascent'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getFilteredAscents } from './ascents.ts'

export const optionalAscentInputSchema = z
  .object({
    climbingDiscipline: ascentSchema.shape.climbingDiscipline.optional(),
    year: number().optional(),
    style: ascentSchema.shape.style.optional(),
  })
  .optional()
export type OptionalAscentInput = z.infer<typeof optionalAscentInputSchema>

const gradeDescriptionSchema = z.object({
  grade: ascentSchema.shape.topoGrade,
  Onsight: number(),
  OnsightColor: string(),
  Flash: number(),
  FlashColor: string(),
  Redpoint: number(),
  RedpointColor: string(),
})

export type GradeDescription = z.infer<typeof gradeDescriptionSchema>

export const gradesRouter = createTRPCRouter({
  getAllGrades: publicProcedure
    .input(optionalAscentInputSchema)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      const filteredGrades = filteredAscents.map(({ topoGrade }) => topoGrade)

      return [...new Set(filteredGrades)].sort()
    }),
  getFrequency: publicProcedure
    .input(optionalAscentInputSchema)
    .output(gradeDescriptionSchema.array())
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

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
    .input(optionalAscentInputSchema)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      const filteredNumberGrades = filteredAscents.map(({ topoGrade }) =>
        fromGradeToNumber(topoGrade as Grade),
      )

      return fromNumberToGrade(Math.round(average(filteredNumberGrades)))
    }),
  getMinMax: publicProcedure
    .input(optionalAscentInputSchema)
    .output(z.tuple([gradeSchema, gradeSchema]))
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      if (filteredAscents.length === 0)
        return [fromNumberToGrade(1), fromNumberToGrade(_GRADES.length)]

      const filteredNumberGrades = filteredAscents.map(({ topoGrade }) =>
        fromGradeToNumber(topoGrade),
      )

      const lowestGrade = fromNumberToGrade(Math.min(...filteredNumberGrades))
      const highestGrade = fromNumberToGrade(Math.max(...filteredNumberGrades))
      return [lowestGrade, highestGrade]
    }),
})
