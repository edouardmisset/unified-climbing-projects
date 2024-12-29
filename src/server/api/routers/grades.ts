import { average } from '@edouardmisset/math/average.ts'

import { number, string, z } from 'zod'
import { fromGradeToNumber, fromNumberToGrade } from '~/helpers/converters'
import { type Grade, _GRADES, ascentSchema, gradeSchema } from '~/schema/ascent'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getFilteredAscents, optionalAscentFilterSchema } from './ascents'

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
    .input(optionalAscentFilterSchema)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      const filteredGrades = filteredAscents.map(({ topoGrade }) => topoGrade)

      return [...new Set(filteredGrades)].sort()
    }),
  getAverage: publicProcedure
    .input(optionalAscentFilterSchema)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      const filteredNumberGrades = filteredAscents.map(({ topoGrade }) =>
        fromGradeToNumber(topoGrade as Grade),
      )

      return fromNumberToGrade(Math.round(average(filteredNumberGrades)))
    }),
  getMinMax: publicProcedure
    .input(optionalAscentFilterSchema)
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
