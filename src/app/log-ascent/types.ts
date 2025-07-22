import { stringifyDate } from '@edouardmisset/date/convert-string-date.ts'
import { z } from 'zod'
import { fromNumberToGrade } from '~/helpers/grade-converter.ts'
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

// Base schema is the original ascentSchema - the source of truth
const baseAscentSchema = ascentSchema

// Schema for internal form data (raw HTML form values)
// Pick only the fields we need for the form and adjust types for HTML inputs
export const internalFormDataSchema = baseAscentSchema
  .pick({
    area: true,
    comments: true,
    routeName: true,
  })
  .extend({
    // Form-specific fields and type adjustments
    climbingDiscipline: climbingDisciplineSchema.optional(), // Can be undefined initially
    crag: z.string().optional(), // Can be empty initially
    style: ascentStyleSchema.optional(), // Can be undefined initially
    tries: z.string(), // HTML input gives string
    date: z.string(), // HTML date input gives string
    personalGrade: z.number(), // We handle grade as number internally
    topoGrade: z.number(), // We handle grade as number internally
    height: z.string().optional(), // HTML input gives string
    rating: z.string().optional(), // HTML input gives string
    holds: z.string().optional(), // HTML input gives string (can be empty)
    profile: z.string().optional(), // HTML input gives string (can be empty)
  })

export type InternalFormData = z.infer<typeof internalFormDataSchema>

// Schema for form input (what React Hook Form expects on initial load)
export const ascentFormInputSchema = internalFormDataSchema.extend({
  date: z.date().transform(date => stringifyDate(date)),
  crag: z.string().optional(), // Optional in input
  height: z.number().int().min(0).max(MAX_HEIGHT).transform(String).optional(),
  rating: z.number().int().min(0).max(MAX_RATING).transform(String).optional(),
  tries: z
    .string()
    .min(1)
    .refine(val => _1To9999RegEx.test(val), {
      message: `The number of tries should be a number between 1 and ${MAX_TRIES}`,
    })
    .transform(Number)
    .transform(num => num?.toString()),
})

export type AscentFormInput = z.input<typeof ascentFormInputSchema>

// Schema for form output (what the action receives and validates)
// This should transform back to match the original ascentSchema as closely as possible
export const ascentFormOutputSchema = internalFormDataSchema.extend({
  climbingDiscipline: climbingDisciplineSchema, // Required in output
  crag: z.string().min(1).trim(), // Required and trimmed in output
  date: z.string().transform(s => new Date(s).toISOString()),
  height: z
    .string()
    .transform(height =>
      height === undefined || height === '' ? undefined : Number(height),
    ),
  holds: z
    .string()
    .optional()
    .transform(holds => {
      if (!holds || holds === '') return undefined
      // Use the proper enum schema validation
      const parsed = holdsSchema.safeParse(holds)
      return parsed.success ? parsed.data : undefined
    }),
  personalGrade: z
    .number()
    .or(z.string())
    .transform(val => fromNumberToGrade(Number(val))),
  profile: z
    .string()
    .optional()
    .transform(profile => {
      if (!profile || profile === '') return undefined
      // Use the proper enum schema validation
      const parsed = profileSchema.safeParse(profile)
      return parsed.success ? parsed.data : undefined
    }),
  rating: z
    .string()
    .transform(rating =>
      rating === undefined || rating === '' ? undefined : Number(rating),
    ),
  routeName: z.string().trim(),
  style: ascentStyleSchema.optional().default('Redpoint'),
  topoGrade: z
    .number()
    .or(z.string())
    .transform(val => fromNumberToGrade(Number(val))),
  tries: z
    .string()
    .min(1)
    .refine(val => _1To9999RegEx.test(val), {
      message: `The number of tries should be a number between 1 and ${MAX_TRIES}`,
    })
    .transform(Number),
})

export type AscentFormOutput = z.input<typeof ascentFormOutputSchema>
