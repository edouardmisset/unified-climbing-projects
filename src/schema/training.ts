import { number, string, z } from 'zod'
import { climbingDisciplineSchema } from './ascent.ts'

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

export const SESSION_TYPES_TO_LABELS = {
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
  return SESSION_TYPES_TO_LABELS[sessionType]
}

export const ANATOMICAL_REGIONS = ['Ar', 'Fi', 'Ge'] as const

export const ANATOMICAL_REGIONS_TO_LABELS = {
  Ar: 'Arms',
  Fi: 'Fingers',
  Ge: 'General',
} as const satisfies Record<(typeof ANATOMICAL_REGIONS)[number], string>

export function fromAnatomicalRegionToLabel(
  anatomicalRegion: (typeof ANATOMICAL_REGIONS)[number],
) {
  return ANATOMICAL_REGIONS_TO_LABELS[anatomicalRegion]
}

export const ENERGY_SYSTEMS = ['AA', 'AL', 'AE'] as const

export const ENERGY_SYSTEMS_TO_LABELS = {
  AA: 'Anaerobic Alactic',
  AL: 'Anaerobic Lactic',
  AE: 'Aerobic',
} as const satisfies Record<(typeof ENERGY_SYSTEMS)[number], string>

export function fromEnergySystemToLabel(
  energySystem: (typeof ENERGY_SYSTEMS)[number],
) {
  return ENERGY_SYSTEMS_TO_LABELS[energySystem]
}

export const sessionTypeSchema = z.enum(SESSION_TYPES)
export const energySystemSchema = z.enum(ENERGY_SYSTEMS)
export const anatomicalRegionSchema = z.enum(ANATOMICAL_REGIONS)

export const percentSchema = number().int().min(0).max(100)

export const trainingSessionSchema = z.object({
  anatomicalRegion: anatomicalRegionSchema.optional(),
  climbingDiscipline: climbingDisciplineSchema.optional(),
  comments: string().optional(),
  date: string(),
  energySystem: energySystemSchema.optional(),
  gymCrag: string().optional(),
  intensity: percentSchema.optional(),
  load: percentSchema.optional(),
  sessionType: sessionTypeSchema.optional(),
  volume: percentSchema.optional(),
  id: number(),
})
export type TrainingSession = z.infer<typeof trainingSessionSchema>
