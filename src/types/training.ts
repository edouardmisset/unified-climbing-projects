import { Temporal } from '@js-temporal/polyfill'
import { number, string, z } from 'zod'

const sessionTypeSchema = z.enum([
  'En',
  'PE',
  'SE',
  'MS',
  'Ex',
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

const frenchDateFormat = /^\d{1,2}\/\d{1,2}\/\d{4}$/gi

const percentSchema = number().min(0).max(100)
export const trainingSessionSchema = z.object({
  date: string()
    .nonempty()
    .regex(frenchDateFormat)
    .transform(stringDate => {
      const [day, month, year] = stringDate.split('/').map(Number)
      return Temporal.PlainDate.from(
        { day, month, year },
        { overflow: 'reject' },
      )
    }),
  sessionType: sessionTypeSchema.optional(),
  volume: percentSchema.optional(),
  anatomicalRegion: z.enum(['Ar', 'Fi', 'Ge']).optional(),
  energySystem: z.enum(['AA', 'AL', 'AE']).optional(),
  routeOrBouldering: z.enum(['Route', 'Bouldering', 'Multi-Pitch']).optional(),
  gymCrag: string().optional(),
  comments: string().optional(),
  intensity: percentSchema.optional(),
  load: percentSchema.optional(),
})
export type TrainingSession = z.infer<typeof trainingSessionSchema>
