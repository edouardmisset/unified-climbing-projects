import { z } from '~/helpers/zod'
import {
  ascentDisciplineSchema,
  ascentDomainSchema,
  ascentGradeSchema,
  ascentHoldsSchema,
  ascentProfileSchema,
  ascentStyleSchema,
} from '~/domain/ascent'
import { optionalAscentYear, periodSchema } from '~/schema/generic'

export const optionalAscentFilterSchema = z
  .object({
    area: ascentDomainSchema.shape.area,
    discipline: ascentDisciplineSchema,
    crag: ascentDomainSchema.shape.crag,
    grade: ascentGradeSchema,
    height: ascentDomainSchema.shape.height,
    holds: ascentHoldsSchema,
    period: periodSchema,
    profile: ascentProfileSchema,
    rating: ascentDomainSchema.shape.rating,
    style: ascentStyleSchema,
    tries: ascentDomainSchema.shape.tries,
    year: optionalAscentYear,
  })
  .partial()
  .optional()
