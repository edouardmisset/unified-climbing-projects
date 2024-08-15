import { stringifyDate, datification } from "@edouardmisset/utils"
import { z } from "zod"
import { convertGradeToNumber, convertNumberToGrade } from "~/helpers/converter"
import { gradeSchema, holdsSchema, profileSchema } from "~/types/ascent"
import { climbingDisciplineSchema } from "~/types/training"
import { MAX_HEIGHT, MAX_RATING } from "./constants"

const futureDateErrorMessage =
  "Date should be in the past. We can't see in the future yet ;)"

export const ascentFormInputSchema = z.object({
  numberOfTries: z.number().min(1).step(1).optional(),
  topoGrade: gradeSchema
    .transform(grade => convertGradeToNumber(grade))
    .optional(),
  personalGrade: gradeSchema
    .transform(grade => convertGradeToNumber(grade))
    .optional(),
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


export const ascentFormOutputSchema = z.object({
  numberOfTries: z.number().min(1).step(1).optional(),
  topoGrade: z
    .string()
    .refine(stringNumberGrade =>
      convertNumberToGrade(Number(stringNumberGrade)),
    ),
  personalGrade: z
    .string()
    .refine(stringNumberGrade =>
      convertNumberToGrade(Number(stringNumberGrade)),
    ),
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
    .min(1)
    .max(3)
    .refine(val => /^0*(?:[1-9][0-9]?|100)$/.test(val), {
      message: 'Height should be a number between 0 and 100',
    })
    .transform(val => Number(val))
    .optional(),
  rating: z
    .string()
    .min(1)
    .max(1)
    .refine(val => /^[0-5]$/.test(val), {
      message: 'Rating should be a number between 0 and 5',
    })
    .transform(val => Number(val))
    .optional(),
  profile: profileSchema.optional(), // should be an enum : Vertical, overhang, slab...
  comments: z.string().optional(),
})