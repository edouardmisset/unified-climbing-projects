import { stringifyDate, datification } from "@edouardmisset/utils"
import { string, z } from "zod"
import { convertGradeToNumber, convertNumberToGrade } from "~/helpers/converter"
import { gradeSchema, holdsSchema, profileSchema } from "~/types/ascent"
import { climbingDisciplineSchema } from "~/types/training"
import { MAX_HEIGHT, MAX_RATING, MAX_TRIES, MIN_HEIGHT, MIN_RATING } from "./constants"

const futureDateErrorMessage =
  "Date should be in the past. We can't see in the future yet ;)"

const optionalGradeToNumberSchema = gradeSchema
  .transform(grade => convertGradeToNumber(grade))
  .optional()
const numberOfTriesSchema = z.string().min(1).max(MAX_TRIES.toString().length).refine(val => /^[1-9999]$/.test(val), {
  message: `The number of tries should be a number between 1 and ${MAX_TRIES}`,
}).transform(st => Number(st)).optional()
export const ascentFormInputSchema = z.object({
  numberOfTries: numberOfTriesSchema.transform(num => num?.toString()),
  topoGrade: optionalGradeToNumberSchema,
  personalGrade: optionalGradeToNumberSchema,
  routeName: z.string().optional(),
  routeOrBoulder: climbingDisciplineSchema.optional(),
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


const numberGradeToGradeSchema = z
  .number().or(string())
  .transform(stringOrNumberGrade =>
    convertNumberToGrade(Number(stringOrNumberGrade)),
  )

export const ascentFormOutputSchema = z.object({
  numberOfTries: numberOfTriesSchema,
  topoGrade: numberGradeToGradeSchema,
  personalGrade: numberGradeToGradeSchema,
  routeName: z.string().trim(),
  routeOrBoulder: climbingDisciplineSchema,
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
    .refine(val => /^0*(?:[1-9][0-9]?|100)$/.test(val), {
      message: `Height should be a number between ${MIN_HEIGHT} and ${MAX_HEIGHT}`,
    })
    .transform(val => Number(val))
    .optional(),
  rating: z
    .string()
    .min(MIN_RATING.toString().length)
    .max(MAX_RATING.toString().length)
    .refine(val => /^[0-5]$/.test(val), {
      message: `Rating should be a number between ${MIN_RATING} and ${MAX_RATING}`,
    })
    .transform(val => Number(val))
    .optional(),
  profile: profileSchema.optional(),
  comments: z.string().optional(),
})