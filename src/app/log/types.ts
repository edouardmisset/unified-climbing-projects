import { stringifyDate } from '@edouardmisset/date'
import { string, z } from 'zod'
import { fromGradeToNumber, fromNumberToGrade } from '~/helpers/converters'
import {
  ascentStyleSchema,
  gradeSchema,
  holdsSchema,
  profileSchema,
} from '~/schema/ascent'
import { climbingDisciplineSchema } from '~/schema/ascent'
import {
  MAX_HEIGHT,
  MAX_RATING,
  MAX_TRIES,
  MIN_HEIGHT,
  MIN_RATING,
  _0To5RegEx,
  _0To100RegEx,
  _1To9999RegEx,
} from './constants.ts'

const optionalGradeToNumberSchema = gradeSchema
  .transform(grade => fromGradeToNumber(grade))
  .optional()
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
  topoGrade: optionalGradeToNumberSchema,
  personalGrade: optionalGradeToNumberSchema,
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
  holds: holdsSchema.optional(),
  height: z
    .string()
    .min(MIN_HEIGHT.toString().length)
    .max(MAX_HEIGHT.toString().length)
    .refine(val => _0To100RegEx.test(val), {
      message: `Height should be a number between ${MIN_HEIGHT} and ${MAX_HEIGHT}`,
    })
    .transform(val => Number(val))
    .optional(),
  rating: z
    .string()
    .min(MIN_RATING.toString().length)
    .max(MAX_RATING.toString().length)
    .refine(val => _0To5RegEx.test(val), {
      message: `Rating should be a number between ${MIN_RATING} and ${MAX_RATING}`,
    })
    .transform(val => Number(val))
    .optional(),
  profile: profileSchema.optional(),
  comments: z.string().optional(),
})
