import { number, string, z } from 'zod'

const sessionTypeSchema = z.enum([
  'En',
  'PE',
  'SE',
  'MS',
  'Out',
  'Po',
  'Ta',
  'Ro',
  'St',
  'Sk',
  'Sg',
  'Co',
  'CS',
  'FB',
])

const percentSchema = number().min(0).max(100)

export const climbingDisciplineSchema = z.enum([
  'Route',
  'Boulder',
  'Multi-Pitch',
])

const ANATOMICAL_REGION = ['Ar', 'Fi', 'Ge'] as const
const ENERGY_SYSTEM = ['AA', 'AL', 'AE'] as const

export const trainingSessionSchema = z.object({
  anatomicalRegion: z.enum(ANATOMICAL_REGION).optional(),
  climbingDiscipline: climbingDisciplineSchema.optional(),
  comments: string().optional(),
  date: string(),
  energySystem: z.enum(ENERGY_SYSTEM).optional(),
  gymCrag: string().optional(),
  intensity: percentSchema.optional(),
  load: percentSchema.optional(),
  sessionType: sessionTypeSchema.optional(),
  volume: percentSchema.optional(),
})
export type TrainingSession = z.infer<typeof trainingSessionSchema>
