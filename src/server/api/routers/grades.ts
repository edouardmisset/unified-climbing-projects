import { average } from '@edouardmisset/math/average.ts'

import { number, string, z } from 'zod'
import { fromGradeToNumber, fromNumberToGrade } from '~/helpers/converters'
import { filterAscents } from '~/helpers/filter-ascents'
import { getGradeFrequency } from '~/helpers/get-grade-frequency.ts'
import {
  type Grade,
  _GRADES,
  ascentSchema,
  ascentStyleSchema,
  climbingDisciplineSchema,
  gradeSchema,
  holdsSchema,
  profileSchema,
} from '~/schema/ascent'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getAllAscents } from '~/services/ascents'

export const optionalAscentInputSchema = z
  .object({
    climbingDiscipline: climbingDisciplineSchema.optional(),
    crag: ascentSchema.shape.crag.optional(),
    grade: gradeSchema.optional(),
    height: ascentSchema.shape.height.optional(),
    holds: holdsSchema.optional(),
    profile: profileSchema.optional(),
    style: ascentStyleSchema.optional(),
    tries: ascentSchema.shape.tries.optional(),
    year: number().optional(),
    rating: ascentSchema.shape.rating.optional(),
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

      return getGradeFrequency(filteredAscents)
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

export async function getFilteredAscents(input?: OptionalAscentInput) {
  const ascents = await getAllAscents()
  return filterAscents(ascents, input)
}
