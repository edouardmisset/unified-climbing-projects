import { stringifyDate } from '@edouardmisset/date/convert-string-date.ts'
import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { string, z } from 'zod'
import { fromNumberToGrade } from '~/helpers/converters'
import {
  ascentStyleSchema,
  climbingDisciplineSchema,
  holdsSchema,
  profileSchema,
} from '~/schema/ascent'
import {
  MAX_HEIGHT,
  MAX_RATING,
  MAX_TRIES,
  MIN_HEIGHT,
  MIN_RATING,
  _1To9999RegEx,
} from './constants.ts'

const optionalNumberGradeSchema = z.number().optional()
const numberOfTriesSchema = z
  .string()
  .min(1)
  .refine(val => _1To9999RegEx.test(val), {
    message: `The number of tries should be a number between 1 and ${MAX_TRIES}`,
  })
  .transform(st => Number(st))
export const ascentFormInputSchema = z.object({
  area: z.string().optional(),
  tries: numberOfTriesSchema.transform(num => num?.toString()),
  style: ascentStyleSchema.optional(),
  topoGrade: optionalNumberGradeSchema,
  personalGrade: optionalNumberGradeSchema,
  routeName: z.string().optional(),
  climbingDiscipline: climbingDisciplineSchema.optional(),
  crag: z.string().optional(), // pick from a look up in DB
  date: z.date().transform(date => stringifyDate(date)),
  holds: holdsSchema.optional(),
  height: z.number().min(0).max(MAX_HEIGHT).transform(String).optional(),
  rating: z
    .number()
    .min(0)
    .max(MAX_RATING)
    .transform(val => String(val))
    .optional(),
  profile: profileSchema.optional(),
  comments: z.string().optional(),
})

export type AscentFormInput = z.input<typeof ascentFormInputSchema>

const numberGradeToGradeSchema = z
  .number()
  .or(string())
  .transform(stringOrNumberGrade =>
    fromNumberToGrade(Number(stringOrNumberGrade)),
  )

export const ascentFormOutputSchema = z.object({
  area: z.string().optional(),
  tries: numberOfTriesSchema,
  style: ascentStyleSchema.optional().default('Redpoint'),
  topoGrade: numberGradeToGradeSchema,
  personalGrade: numberGradeToGradeSchema,
  routeName: z.string().trim(),
  climbingDiscipline: climbingDisciplineSchema,
  crag: z.string().min(1).trim(),
  date: z.string().transform(s => new Date(s).toISOString()), // yyyy-mm-dd
  holds: holdsSchema,
  profile: profileSchema,
  height: z
    .string()
    .superRefine((height, ctx) => {
      const numberHeight = Number(height)

      if (MIN_HEIGHT <= numberHeight && numberHeight <= MAX_HEIGHT) {
        return z.NEVER
      }

      if (!isValidNumber(numberHeight)) {
        ctx.addIssue({
          message: 'Height should be a valid number',
          code: z.ZodIssueCode.not_finite,
        })
      }
      if (!Number.isInteger(numberHeight)) {
        ctx.addIssue({
          message: 'Height should be an integer',
          code: z.ZodIssueCode.invalid_type,
          expected: 'integer',
          received: 'float',
        })
      }

      if (!(MIN_HEIGHT <= numberHeight && numberHeight <= MAX_HEIGHT)) {
        ctx.addIssue({
          message: `Height (${numberHeight}) should be a number between ${MIN_HEIGHT} and ${MAX_HEIGHT}`,
          code: z.ZodIssueCode.custom,
        })
      }
    })
    .transform(height =>
      height === undefined || height === '' ? undefined : Number(height),
    ),
  rating: z
    .string()
    .superRefine((rating, ctx) => {
      if (rating === undefined || rating === '') {
        return z.NEVER
      }

      const numberRating = Number(rating)

      if (!isValidNumber(numberRating)) {
        ctx.addIssue({
          message: 'Rating should be a valid number',
          code: z.ZodIssueCode.not_finite,
        })
      }
      if (!Number.isInteger(numberRating)) {
        ctx.addIssue({
          message: 'Rating should be an integer',
          code: z.ZodIssueCode.invalid_type,
          expected: 'integer',
          received: 'float',
        })
      }

      if (!(MIN_RATING <= numberRating && numberRating <= MAX_RATING)) {
        ctx.addIssue({
          message: `Rating (${rating}) should be a number between ${MIN_RATING} and ${MAX_RATING}`,
          code: z.ZodIssueCode.custom,
        })
      }
    })
    .transform(rating =>
      rating === undefined || rating === '' ? undefined : Number(rating),
    ),
  comments: z.string().optional(),
})
