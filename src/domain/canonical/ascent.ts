import { z } from '~/helpers/zod'
import {
  calendarDateSchema,
  convexSystemFields,
  emptyOrIntegerCellSchema,
  emptyOrNonEmptyStringSchema,
  emptyStringToUndefined,
  integerCellSchema,
  nonEmptyStringSchema,
  nonNegativeIntegerSchema,
  optionalFormStringSchema,
  optionalIntegerCellSchema,
  optionalNonEmptyStringSchema,
  positiveIntegerCellSchema,
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

export const ascentDomainSchema = z.object(ascentDomainFields).strict()

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

export const ascentPublicInputSchema = z.object(ascentDomainFields).strict()

export const ascentPublicOutputSchema = z
  .object({
    ...ascentDomainFields,
    ...convexSystemFields,
  })
  .strict()

const optionalFormIntegerSchema = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().int().min(0).optional(),
)

const optionalFormRatingSchema = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().int().min(0).max(MAX_ASCENT_RATING).optional(),
)

const optionalFormEnum = <T extends z.EnumValues>(values: T) =>
  z.preprocess(emptyStringToUndefined, z.enum(values).optional())

export const ascentFormSchema = z
  .object({
    area: optionalFormStringSchema,
    comments: optionalFormStringSchema,
    crag: nonEmptyStringSchema,
    date: calendarDateSchema,
    discipline: ascentDisciplineSchema,
    grade: ascentGradeSchema,
    height: optionalFormIntegerSchema,
    holds: optionalFormEnum(ASCENT_HOLDS),
    name: nonEmptyStringSchema,
    personalGrade: optionalFormEnum(ASCENT_GRADES),
    profile: optionalFormEnum(ASCENT_PROFILES),
    rating: optionalFormRatingSchema,
    style: ascentStyleSchema,
    tries: z.coerce.number().int().min(1),
  })
  .strict()

export const ascentImportRowSchema = z
  .object({
    area: optionalFormStringSchema,
    comments: optionalFormStringSchema,
    crag: nonEmptyStringSchema,
    date: calendarDateSchema,
    discipline: ascentDisciplineSchema,
    grade: ascentGradeSchema,
    height: optionalIntegerCellSchema,
    holds: optionalFormEnum(ASCENT_HOLDS),
    name: nonEmptyStringSchema,
    personalGrade: optionalFormEnum(ASCENT_GRADES),
    profile: optionalFormEnum(ASCENT_PROFILES),
    rating: z.preprocess(emptyStringToUndefined, integerCellSchema.pipe(ratingSchema).optional()),
    style: ascentStyleSchema,
    tries: positiveIntegerCellSchema,
  })
  .strict()

export const ascentExportRowSchema = z
  .object({
    discipline: ascentDisciplineSchema,
    name: nonEmptyStringSchema,
    grade: ascentGradeSchema,
    crag: nonEmptyStringSchema,
    date: calendarDateSchema,
    style: ascentStyleSchema,
    tries: z.string().regex(/^[1-9]\d*$/),
    area: emptyOrNonEmptyStringSchema,
    comments: emptyOrNonEmptyStringSchema,
    height: emptyOrIntegerCellSchema,
    holds: z.union([z.literal(''), ascentHoldsSchema]),
    personalGrade: z.union([z.literal(''), ascentGradeSchema]),
    profile: z.union([z.literal(''), ascentProfileSchema]),
    rating: z.union([z.literal(''), z.string().regex(/^[0-5]$/)]),
  })
  .strict()

export type AscentDomain = z.infer<typeof ascentDomainSchema>
export type AscentRecord = AscentDomain & { _id: string }
export type AscentStoredFields = z.infer<typeof ascentStoredFieldsSchema>
export type AscentStoredDocument = z.infer<typeof ascentStoredDocumentSchema>
export type AscentPublicInput = z.infer<typeof ascentPublicInputSchema>
export type AscentPublicOutput = z.infer<typeof ascentPublicOutputSchema>
export type AscentFormInput = z.input<typeof ascentFormSchema>
export type AscentFormValue = z.output<typeof ascentFormSchema>
export type AscentImportRowInput = z.input<typeof ascentImportRowSchema>
export type AscentImportRow = z.output<typeof ascentImportRowSchema>
export type AscentExportRow = z.infer<typeof ascentExportRowSchema>
