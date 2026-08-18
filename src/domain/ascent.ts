import { z } from 'zod'
import { isAscentStyleValidForTries } from './ascent-rules'
import {
  calendarDateSchema,
  convexSystemFields,
  nonEmptyStringSchema,
  nonNegativeIntegerSchema,
  createOptionalIntegerCellCodec,
  optionalEnumCodec,
  optionalNonEmptyStringSchema,
  optionalTextCodec,
  positiveIntegerCellCodec,
  positiveIntegerSchema,
  serverControlledFields,
} from './common'

export const ASCENT_DISCIPLINES = ['Sport', 'Bouldering', 'Multi-Pitch'] as const
export const ASCENT_STYLES = ['Onsight', 'Flash', 'Redpoint'] as const

export const ASCENT_GRADES = [
  '1a',
  '1a+',
  '1b',
  '1b+',
  '1c',
  '1c+',
  '2a',
  '2a+',
  '2b',
  '2b+',
  '2c',
  '2c+',
  '3a',
  '3a+',
  '3b',
  '3b+',
  '3c',
  '3c+',
  '4a',
  '4a+',
  '4b',
  '4b+',
  '4c',
  '4c+',
  '5a',
  '5a+',
  '5b',
  '5b+',
  '5c',
  '5c+',
  '6a',
  '6a+',
  '6b',
  '6b+',
  '6c',
  '6c+',
  '7a',
  '7a+',
  '7b',
  '7b+',
  '7c',
  '7c+',
  '8a',
  '8a+',
  '8b',
  '8b+',
  '8c',
  '8c+',
  '9a',
  '9a+',
  '9b',
  '9b+',
  '9c',
  '9c+',
] as const

export const ASCENT_HOLDS = [
  'Crimp',
  'Jug',
  'Pocket',
  'Sloper',
  'Pinch',
  'Crack',
  'Undercling',
] as const

export const ASCENT_PROFILES = [
  'Vertical',
  'Overhang',
  'Slab',
  'Roof',
  'Arête',
  'Dihedral',
  'Traverse',
] as const

export const ASCENT_CSV_COLUMNS = [
  'discipline',
  'name',
  'grade',
  'crag',
  'date',
  'style',
  'tries',
  'area',
  'comments',
  'height',
  'holds',
  'personalGrade',
  'profile',
  'rating',
] as const

export const ascentDisciplineSchema = z.enum(ASCENT_DISCIPLINES)
export const ascentStyleSchema = z.enum(ASCENT_STYLES)
export const ascentGradeSchema = z.enum(ASCENT_GRADES)
export const ascentHoldsSchema = z.enum(ASCENT_HOLDS)
export const ascentProfileSchema = z.enum(ASCENT_PROFILES)

const MAX_ASCENT_RATING = 5
const ratingSchema = z.number().int().min(0).max(MAX_ASCENT_RATING)

function validateRedpointStyleForTries(
  ascent: { style: (typeof ASCENT_STYLES)[number]; tries: number | string },
  context: z.RefinementCtx,
) {
  if (isAscentStyleValidForTries(ascent.style, ascent.tries)) return

  context.addIssue({
    code: 'custom',
    message: 'Ascents with more than 1 try must use Redpoint style',
    path: ['style'],
  })
}

const ascentDomainFields = {
  area: optionalNonEmptyStringSchema,
  comments: optionalNonEmptyStringSchema,
  crag: nonEmptyStringSchema,
  date: calendarDateSchema,
  discipline: ascentDisciplineSchema,
  grade: ascentGradeSchema,
  height: nonNegativeIntegerSchema.optional(),
  holds: ascentHoldsSchema.optional(),
  name: nonEmptyStringSchema,
  personalGrade: ascentGradeSchema.optional(),
  profile: ascentProfileSchema.optional(),
  rating: ratingSchema.optional(),
  style: ascentStyleSchema,
  tries: positiveIntegerSchema,
} as const

export const ascentDomainSchema = z
  .object(ascentDomainFields)
  .strict()
  .superRefine(validateRedpointStyleForTries)

export const ascentStoredFieldsSchema = z
  .object({
    ...ascentDomainFields,
    ...serverControlledFields,
  })
  .strict()

export const ascentStoredDocumentSchema = z
  .object({
    ...ascentDomainFields,
    ...serverControlledFields,
    ...convexSystemFields,
  })
  .strict()

export const ascentPublicInputSchema = z
  .object(ascentDomainFields)
  .strict()
  .superRefine(validateRedpointStyleForTries)

const ascentPublicOutputObjectSchema = z
  .object({
    ...ascentDomainFields,
    ...convexSystemFields,
  })
  .strict()

export const ascentPublicOutputSchema = ascentPublicOutputObjectSchema

export const ascentListOutputSchema = ascentPublicOutputObjectSchema.omit({ comments: true })

const ascentFormFields = {
  discipline: ascentDisciplineSchema,
  name: nonEmptyStringSchema,
  grade: ascentGradeSchema,
  crag: nonEmptyStringSchema,
  date: calendarDateSchema,
  style: ascentStyleSchema,
  tries: positiveIntegerCellCodec,
  area: optionalTextCodec,
  comments: optionalTextCodec,
  height: createOptionalIntegerCellCodec(),
  holds: optionalEnumCodec(ASCENT_HOLDS),
  personalGrade: optionalEnumCodec(ASCENT_GRADES),
  profile: optionalEnumCodec(ASCENT_PROFILES),
  rating: createOptionalIntegerCellCodec(ratingSchema),
} as const

export const ascentFormObjectSchema = z.object(ascentFormFields).strict()

export const ascentFormSchema = ascentFormObjectSchema.superRefine(validateRedpointStyleForTries)

export const ascentCsvRowCodec = z
  .object(ascentFormFields)
  .superRefine(validateRedpointStyleForTries)

export type AscentDomain = z.infer<typeof ascentDomainSchema>
export type AscentRecord = AscentDomain & { _id: string }
export type AscentListRecord = z.infer<typeof ascentListOutputSchema>
export type AscentStoredFields = z.infer<typeof ascentStoredFieldsSchema>
export type AscentStoredDocument = z.infer<typeof ascentStoredDocumentSchema>
export type AscentPublicInput = z.infer<typeof ascentPublicInputSchema>
export type AscentPublicOutput = z.infer<typeof ascentPublicOutputSchema>
export type AscentFormInput = z.input<typeof ascentFormSchema>
export type AscentFormValue = z.output<typeof ascentFormSchema>
export type AscentCsvRow = z.input<typeof ascentCsvRowCodec>
export type AscentImportRow = z.output<typeof ascentCsvRowCodec>
