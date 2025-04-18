import { stringifyDate } from '@edouardmisset/date/convert-string-date.ts'
import { z } from 'zod'
import { fromNumberToGrade } from '~/helpers/grade-converter.ts'
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
  _1To9999RegEx,
} from './constants.ts'

const optionalNumberGradeSchema = z.number().optional()
const numberOfTriesSchema = z
  .string()
  .min(1)
  .refine(val => _1To9999RegEx.test(val), {
    message: `The number of tries should be a number between 1 and ${MAX_TRIES}`,
  })
  .transform(Number)
export const ascentFormInputSchema = z.object({
  area: z.string().optional(),
  tries: numberOfTriesSchema.transform(num => num?.toString()),
  style: ascentStyleSchema.optional(),
  topoGrade: optionalNumberGradeSchema,
  personalGrade: optionalNumberGradeSchema,
  routeName: z.string().optional(),
  climbingDiscipline: climbingDisciplineSchema.optional(),
  crag: z.string().optional(),
  date: z.date().transform(date => stringifyDate(date)),
  holds: holdsSchema.optional(),
  height: z.number().int().min(0).max(MAX_HEIGHT).transform(String).optional(),
  rating: z.number().int().min(0).max(MAX_RATING).transform(String).optional(),
  profile: profileSchema.optional(),
  comments: z.string().optional(),
})

export type AscentFormInput = z.input<typeof ascentFormInputSchema>

const numberGradeToGradeSchema = z
  .number()
  .or(z.string())
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
  profile: profileSchema.optional(),
  height: z
    .string()
    .transform(height =>
      height === undefined || height === '' ? undefined : Number(height),
    ),
  rating: z
    .string()
    .transform(rating =>
      rating === undefined || rating === '' ? undefined : Number(rating),
    ),
  comments: z.string().optional(),
})
