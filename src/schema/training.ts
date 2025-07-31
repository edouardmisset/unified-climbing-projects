import { z } from 'zod'
import { climbingDisciplineSchema } from './ascent.ts'
import { percentSchema, positiveInteger } from './generic.ts'

export const SESSION_TYPES = [
  'Out',

  'En',
  'PE',
  'SE',

  'MS',
  'Po',
  'CS',

  'Ta',
  'St',
  'Sk',

  'Ro',
  'Sg',
  'Co',
  'FB',
] as const

const SESSION_TYPES_TO_TEXT = {
  Co: 'Core',
  CS: 'Contact Strength',

  En: 'Endurance',
  FB: 'Finger Boarding',

  MS: 'Max Strength',
  Out: 'Outdoor',
  PE: 'Power Endurance',
  Po: 'Power',

  Ro: 'Routine',
  SE: 'Strength Endurance',
  Sg: 'Stretching',
  Sk: 'Skill',
  St: 'Stamina',

  Ta: 'Tapper',
} as const satisfies Record<(typeof SESSION_TYPES)[number], string>

export function fromSessionTypeToLabel(
  sessionType: (typeof SESSION_TYPES)[number],
) {
  return SESSION_TYPES_TO_TEXT[sessionType]
}

export const ANATOMICAL_REGIONS = ['Ar', 'Fi', 'Ge'] as const

const ANATOMICAL_REGIONS_TO_TEXT = {
  Ar: 'Arms',
  Fi: 'Fingers',
  Ge: 'General',
} as const satisfies Record<(typeof ANATOMICAL_REGIONS)[number], string>

export function fromAnatomicalRegionToLabel(
  anatomicalRegion: (typeof ANATOMICAL_REGIONS)[number],
) {
  return ANATOMICAL_REGIONS_TO_TEXT[anatomicalRegion]
}

export const ENERGY_SYSTEMS = ['AA', 'AL', 'AE'] as const

const ENERGY_SYSTEMS_TO_TEXT = {
  AA: 'Anaerobic Alactic',
  AE: 'Aerobic',
  AL: 'Anaerobic Lactic',
} as const satisfies Record<(typeof ENERGY_SYSTEMS)[number], string>

export function fromEnergySystemToLabel(
  energySystem: (typeof ENERGY_SYSTEMS)[number],
) {
  return ENERGY_SYSTEMS_TO_TEXT[energySystem]
}

export const LOAD_CATEGORIES = ['High', 'Medium', 'Low'] as const
export const loadCategorySchema = z.enum(LOAD_CATEGORIES)
export type LoadCategory = z.infer<typeof loadCategorySchema>

const sessionTypeSchema = z.enum(SESSION_TYPES)
const energySystemSchema = z.enum(ENERGY_SYSTEMS)
const anatomicalRegionSchema = z.enum(ANATOMICAL_REGIONS)

export const trainingSessionSchema = z.object({
  anatomicalRegion: anatomicalRegionSchema.optional(),
  climbingDiscipline: climbingDisciplineSchema.optional(),
  comments: z.string().optional(),
  date: z.string(),
  energySystem: energySystemSchema.optional(),
  gymCrag: z.string().optional(),
  id: positiveInteger,
  intensity: percentSchema.optional(),
  load: percentSchema.optional(),
  sessionType: sessionTypeSchema.optional(),
  volume: percentSchema.optional(),
})
export type TrainingSession = z.infer<typeof trainingSessionSchema>

export type TrainingSessionListProps = {
  trainingSessions: TrainingSession[]
}
