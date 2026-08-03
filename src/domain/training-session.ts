import { z } from '~/helpers/zod'
import { ASCENT_DISCIPLINES, ascentDisciplineSchema } from './ascent'
import {
  calendarDateSchema,
  convexSystemFields,
  emptyOrNonEmptyStringSchema,
  emptyOrPercentCellSchema,
  emptyStringToUndefined,
  optionalFormStringSchema,
  optionalNonEmptyStringSchema,
  optionalPercentCellSchema,
  percentSchema,
  serverControlledFields,
} from './common'

export const TRAINING_SESSION_TYPES = [
  'Outdoor',
  'Contact Strength',
  'Power',
  'Max Strength',
  'Endurance',
  'Power Endurance',
  'Strength Endurance',
  'Routine',
  'Finger Board',
  'Core',
  'Stretching',
  'Skill',
  'Stamina',
  'Chill',
] as const

export const ANATOMICAL_REGIONS = ['Arms', 'Fingers', 'General'] as const
export const ENERGY_SYSTEMS = ['Anaerobic Alactic', 'Anaerobic Lactic', 'Aerobic'] as const

export const TRAINING_SESSION_CSV_COLUMNS = [
  'date',
  'type',
  'discipline',
  'location',
  'anatomicalRegion',
  'energySystem',
  'comments',
  'intensity',
  'volume',
] as const

export const trainingSessionTypeSchema = z.enum(TRAINING_SESSION_TYPES)
export const anatomicalRegionSchema = z.enum(ANATOMICAL_REGIONS)
export const energySystemSchema = z.enum(ENERGY_SYSTEMS)

const trainingSessionDomainFields = {
  anatomicalRegion: anatomicalRegionSchema.optional(),
  comments: optionalNonEmptyStringSchema,
  date: calendarDateSchema,
  discipline: ascentDisciplineSchema.optional(),
  energySystem: energySystemSchema.optional(),
  intensity: percentSchema.optional(),
  location: optionalNonEmptyStringSchema,
  type: trainingSessionTypeSchema,
  volume: percentSchema.optional(),
} as const

export const trainingSessionDomainSchema = z.object(trainingSessionDomainFields).strict()

export const trainingSessionStoredFieldsSchema = z
  .object({
    ...trainingSessionDomainFields,
    ...serverControlledFields,
  })
  .strict()

export const trainingSessionStoredDocumentSchema = z
  .object({
    ...trainingSessionDomainFields,
    ...serverControlledFields,
    ...convexSystemFields,
  })
  .strict()

export const trainingSessionPublicInputSchema = z.object(trainingSessionDomainFields).strict()

export const trainingSessionPublicOutputSchema = z
  .object({
    ...trainingSessionDomainFields,
    ...convexSystemFields,
  })
  .strict()

const optionalFormPercentSchema = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().int().min(0).max(100).optional(),
)

const optionalFormEnum = <T extends z.EnumValues>(values: T) =>
  z.preprocess(emptyStringToUndefined, z.enum(values).optional())

export const trainingSessionFormSchema = z
  .object({
    anatomicalRegion: optionalFormEnum(ANATOMICAL_REGIONS),
    comments: optionalFormStringSchema,
    date: calendarDateSchema,
    discipline: optionalFormEnum(ASCENT_DISCIPLINES),
    energySystem: optionalFormEnum(ENERGY_SYSTEMS),
    intensity: optionalFormPercentSchema,
    location: optionalFormStringSchema,
    type: trainingSessionTypeSchema,
    volume: optionalFormPercentSchema,
  })
  .strict()

export const trainingSessionImportRowSchema = z
  .object({
    anatomicalRegion: optionalFormEnum(ANATOMICAL_REGIONS),
    comments: optionalFormStringSchema,
    date: calendarDateSchema,
    discipline: optionalFormEnum(ASCENT_DISCIPLINES),
    energySystem: optionalFormEnum(ENERGY_SYSTEMS),
    intensity: optionalPercentCellSchema,
    location: optionalFormStringSchema,
    type: trainingSessionTypeSchema,
    volume: optionalPercentCellSchema,
  })
  .strict()

export const trainingSessionExportRowSchema = z
  .object({
    date: calendarDateSchema,
    type: trainingSessionTypeSchema,
    discipline: z.union([z.literal(''), ascentDisciplineSchema]),
    location: emptyOrNonEmptyStringSchema,
    anatomicalRegion: z.union([z.literal(''), anatomicalRegionSchema]),
    energySystem: z.union([z.literal(''), energySystemSchema]),
    comments: emptyOrNonEmptyStringSchema,
    intensity: emptyOrPercentCellSchema,
    volume: emptyOrPercentCellSchema,
  })
  .strict()

export type TrainingSessionDomain = z.infer<typeof trainingSessionDomainSchema>
export type TrainingSessionRecord = TrainingSessionDomain & { _id: string }
export type TrainingSessionStoredFields = z.infer<typeof trainingSessionStoredFieldsSchema>
export type TrainingSessionStoredDocument = z.infer<typeof trainingSessionStoredDocumentSchema>
export type TrainingSessionPublicInput = z.infer<typeof trainingSessionPublicInputSchema>
export type TrainingSessionPublicOutput = z.infer<typeof trainingSessionPublicOutputSchema>
export type TrainingSessionFormInput = z.input<typeof trainingSessionFormSchema>
export type TrainingSessionFormValue = z.output<typeof trainingSessionFormSchema>
export type TrainingSessionImportRowInput = z.input<typeof trainingSessionImportRowSchema>
export type TrainingSessionImportRow = z.output<typeof trainingSessionImportRowSchema>
export type TrainingSessionExportRow = z.infer<typeof trainingSessionExportRowSchema>
