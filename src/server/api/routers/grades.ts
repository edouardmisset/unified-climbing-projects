import { average } from '@edouardmisset/math/average.ts'

import { z } from 'zod'
import { fromGradeToNumber, fromNumberToGrade } from '~/helpers/converters'
import { _GRADES, gradeSchema } from '~/schema/ascent'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getFilteredAscents, optionalAscentFilterSchema } from './ascents'

export const gradesRouter = createTRPCRouter({
  getAllGrades: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(gradeSchema.array())
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      const filteredGrades = filteredAscents.map(({ topoGrade }) => topoGrade)

      return [...new Set(filteredGrades)].sort()
    }),
  getAverage: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(gradeSchema)
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      const filteredNumberGrades = filteredAscents.map(({ topoGrade }) =>
        fromGradeToNumber(topoGrade),
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
