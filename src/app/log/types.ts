import { datification, stringifyDate } from '@edouardmisset/date'
import { string, z } from 'zod'
import { convertGradeToNumber, convertNumberToGrade } from '~/helpers/converter'
import { gradeSchema, holdsSchema, profileSchema } from '~/schema/ascent'
import { climbingDisciplineSchema } from '~/types/training'
import {
  MAX_HEIGHT,
  MAX_RATING,
  MAX_TRIES,
  MIN_HEIGHT,
  MIN_RATING,
} from './constants.ts'

const futureDateErrorMessage =
  "Date should be in the past. We can't see in the future yet ;)"

const _1To9999RegEx = /^[1-9999]$/
const _0To100RegEx = /^0*(?:[1-9][0-9]?|100)$/
const _0To5RegEx = /^[0-5]$/

const optionalGradeToNumberSchema = gradeSchema
  .transform(grade => convertGradeToNumber(grade))
  .optional()
const numberOfTriesSchema = z
  .string()
  .min(1)
  .max(MAX_TRIES.toString().length)
  .refine(val => _1To9999RegEx.test(val), {
    message: `The number of tries should be a number between 1 and ${MAX_TRIES}`,
  })
  .transform(st => Number(st))
  .optional()
export const ascentFormInputSchema = z.object({
  area: z.string().optional(),
  tries: numberOfTriesSchema.transform(num => num?.toString()),
  topoGrade: optionalGradeToNumberSchema,
  personalGrade: optionalGradeToNumberSchema,
  routeName: z.string().optional(),
  climbingDiscipline: climbingDisciplineSchema.optional(),
  crag: z.string().optional(), // pick from a look up in DB
  date: z.date().transform(date => stringifyDate(date)),
  holds: holdsSchema.optional(),
  height: z
    .number()
    .min(0)
    .max(MAX_HEIGHT)
    .transform(val => String(val))
    .optional(),
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
    convertNumberToGrade(Number(stringOrNumberGrade)),
  )

export const ascentFormOutputSchema = z.object({
  area: z.string().optional(),
  tries: numberOfTriesSchema,
  topoGrade: numberGradeToGradeSchema,
  personalGrade: numberGradeToGradeSchema,
  routeName: z.string().trim(),
  climbingDiscipline: climbingDisciplineSchema,
  crag: z.string().min(1).trim(),
  date: z
    .string() // yyyy-mm-dd
    .date()
    .transform(dateString => datification(dateString))
    .refine(date => date <= new Date(), {
      message: futureDateErrorMessage,
    }),
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
