import { z } from 'zod'
import { ASCENT_DISCIPLINES, ascentDisciplineSchema } from './ascent'
import {
  calendarDateSchema,
  convexSystemFields,
  optionalEnumCodec,
  optionalNonEmptyStringSchema,
  optionalPercentCellCodec,
  optionalTextCodec,
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

export const trainingSessionListOutputSchema = trainingSessionPublicOutputSchema.omit({
  comments: true,
})

const trainingSessionFormFields = {
  date: calendarDateSchema,
  type: trainingSessionTypeSchema,
  discipline: optionalEnumCodec(ASCENT_DISCIPLINES),
  location: optionalTextCodec,
  anatomicalRegion: optionalEnumCodec(ANATOMICAL_REGIONS),
  energySystem: optionalEnumCodec(ENERGY_SYSTEMS),
  comments: optionalTextCodec,
  intensity: optionalPercentCellCodec,
  volume: optionalPercentCellCodec,
} as const

export const trainingSessionFormSchema = z.object(trainingSessionFormFields).strict()

export const trainingSessionCsvRowCodec = z.object(trainingSessionFormFields)

export type TrainingSessionDomain = z.infer<typeof trainingSessionDomainSchema>
export type TrainingSessionRecord = TrainingSessionDomain & { _id: string }
export type TrainingSessionListRecord = z.infer<typeof trainingSessionListOutputSchema>
export type TrainingSessionStoredFields = z.infer<typeof trainingSessionStoredFieldsSchema>
export type TrainingSessionStoredDocument = z.infer<typeof trainingSessionStoredDocumentSchema>
export type TrainingSessionPublicInput = z.infer<typeof trainingSessionPublicInputSchema>
export type TrainingSessionPublicOutput = z.infer<typeof trainingSessionPublicOutputSchema>
export type TrainingSessionFormInput = z.input<typeof trainingSessionFormSchema>
export type TrainingSessionFormValue = z.output<typeof trainingSessionFormSchema>
export type TrainingSessionCsvRow = z.input<typeof trainingSessionCsvRowCodec>
export type TrainingSessionImportRow = z.output<typeof trainingSessionCsvRowCodec>
