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
    climbingDiscipline: climbingDisciplineSchema,
    crag: ascentSchema.shape.crag,
    grade: gradeSchema,
    height: ascentSchema.shape.height,
    holds: holdsSchema,
    profile: profileSchema,
    rating: ascentSchema.shape.rating,
    style: ascentStyleSchema,
    tries: ascentSchema.shape.tries,
    year: optionalAscentYear,
    period: periodSchema,
  })
  .partial()
  .optional()
