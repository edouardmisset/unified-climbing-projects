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
export const ANATOMICAL_REGIONS = ['Ar', 'Fi', 'Ge'] as const
export const ENERGY_SYSTEMS = ['AA', 'AL', 'AE'] as const

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
