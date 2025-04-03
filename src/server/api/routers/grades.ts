import { average } from '@edouardmisset/math/average.ts'

import { z } from 'zod'
import { fromGradeToNumber, fromNumberToGrade } from '~/helpers/grade-converter'
import { minMaxGrades } from '~/helpers/min-max-grades'
import { compareStringsAscending } from '~/helpers/sort-strings'
import { gradeSchema } from '~/schema/ascent'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getFilteredAscents, optionalAscentFilterSchema } from './ascents'

export const gradesRouter = createTRPCRouter({
  getAllGrades: publicProcedure
    .input(optionalAscentFilterSchema)
    .output(gradeSchema.array())
    .query(async ({ input }) => {
      const filteredAscents = await getFilteredAscents(input)

      const filteredGrades = filteredAscents.map(({ topoGrade }) => topoGrade)

      return [...new Set(filteredGrades)].sort((a, b) =>
        compareStringsAscending(a, b),
      )
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
      return minMaxGrades(filteredAscents)
    }),
})
