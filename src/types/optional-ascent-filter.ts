import { z } from '~/helpers/zod'
import {
  ascentSchema,
  ascentStyleSchema,
  climbingDisciplineSchema,
  gradeSchema,
  holdsSchema,
  profileSchema,
} from '~/schema/ascent'
import { optionalAscentYear, periodSchema } from '~/schema/generic'

export const optionalAscentFilterSchema = z
  .object({
    area: ascentSchema.unwrap().shape.area,
    climbingDiscipline: climbingDisciplineSchema,
    crag: ascentSchema.unwrap().shape.crag,
    grade: gradeSchema,
    height: ascentSchema.unwrap().shape.height,
    holds: holdsSchema,
    period: periodSchema,
    profile: profileSchema,
    rating: ascentSchema.unwrap().shape.rating,
    style: ascentStyleSchema,
    tries: ascentSchema.unwrap().shape.tries,
    year: optionalAscentYear,
  })
  .partial()
  .optional()
