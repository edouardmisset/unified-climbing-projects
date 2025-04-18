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
  Out: 'Outdoor',

  En: 'Endurance',
  PE: 'Power Endurance',
  SE: 'Strength Endurance',

  MS: 'Max Strength',
  Po: 'Power',
  CS: 'Contact Strength',

  Ta: 'Tapper',
  St: 'Stamina',
  Sk: 'Skill',

  Ro: 'Routine',
  Sg: 'Stretching',
  Co: 'Core',
  FB: 'Finger Boarding',
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
  AL: 'Anaerobic Lactic',
  AE: 'Aerobic',
} as const satisfies Record<(typeof ENERGY_SYSTEMS)[number], string>

export function fromEnergySystemToLabel(
  energySystem: (typeof ENERGY_SYSTEMS)[number],
) {
  return ENERGY_SYSTEMS_TO_TEXT[energySystem]
}

export const LOAD_CATEGORIES = ['High', 'Medium', 'Low'] as const
export type LoadCategory = (typeof LOAD_CATEGORIES)[number]

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
  intensity: percentSchema.optional(),
  load: percentSchema.optional(),
  sessionType: sessionTypeSchema.optional(),
  volume: percentSchema.optional(),
  id: positiveInteger,
})
export type TrainingSession = z.infer<typeof trainingSessionSchema>
