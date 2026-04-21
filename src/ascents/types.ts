import { z } from '~/shared/helpers/zod'
import {
  ascentSchema,
  ascentStyleSchema,
  climbingDisciplineSchema,
  gradeSchema,
  holdsSchema,
  profileSchema,
} from '~/ascents/schema'
import { optionalAscentYear, periodSchema } from '~/shared/schema'

export const optionalAscentFilterSchema = z
  .object({
    area: ascentSchema.shape.area,
    climbingDiscipline: climbingDisciplineSchema,
    crag: ascentSchema.shape.crag,
    grade: gradeSchema,
    height: ascentSchema.shape.height,
    holds: holdsSchema,
    period: periodSchema,
    profile: profileSchema,
    rating: ascentSchema.shape.rating,
    style: ascentStyleSchema,
    tries: ascentSchema.shape.tries,
    year: optionalAscentYear,
  })
  .partial()
  .optional()
