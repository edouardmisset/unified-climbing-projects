import { stringifyDate } from '@edouardmisset/date/convert-string-date.ts'
import { getDateAtNoon } from '~/helpers/date.ts'
import { emptyStringToUndefined } from '~/helpers/empty-string-to-undefined.ts'
import { fromNumberToGrade } from '~/helpers/grade-converter.ts'
import { z } from '~/helpers/zod'
import {
  ascentSchema,
  ascentStyleSchema,
  climbingDisciplineSchema,
  holdsSchema,
  profileSchema,
} from '~/schema/ascent'
import {
  _1To9999RegEx,
  MAX_HEIGHT,
  MAX_RATING,
  MAX_TRIES,
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
  climbingDiscipline: climbingDisciplineSchema.optional(),
  comments: z.string().optional(),
  crag: z.string().optional(),
  date: z.date().transform(date => stringifyDate(date)),
  height: z.number().int().min(0).max(MAX_HEIGHT).transform(String).optional(),
  holds: holdsSchema.optional(),
  personalGrade: optionalNumberGradeSchema,
  profile: profileSchema.optional(),
  rating: z.number().int().min(0).max(MAX_RATING).transform(String).optional(),
  routeName: z.string().optional(),
  style: ascentStyleSchema.optional(),
  topoGrade: optionalNumberGradeSchema,
  tries: numberOfTriesSchema.transform(num => num?.toString()),
})

export type AscentFormInput = z.input<typeof ascentFormInputSchema>

const numberGradeToGradeSchema = z
  .number()
  .or(z.string())
  .transform(stringOrNumberGrade =>
    fromNumberToGrade(Number(stringOrNumberGrade)),
  )

export const ascentFormOutputSchema = ascentSchema.omit({ _id: true }).extend({
  comments: z.preprocess(emptyStringToUndefined, z.string().optional()),
  date: z.string().transform(s => getDateAtNoon(new Date(s)).toISOString()),
  height: z
    .string()
    .transform(height => (height === '' ? undefined : Number(height))),
  holds: z.preprocess(emptyStringToUndefined, holdsSchema.optional()),
  personalGrade: numberGradeToGradeSchema,
  profile: z.preprocess(emptyStringToUndefined, profileSchema.optional()),
  rating: z
    .string()
    .transform(rating => (rating === '' ? undefined : Number(rating))),
  topoGrade: numberGradeToGradeSchema,
  tries: numberOfTriesSchema,
})
