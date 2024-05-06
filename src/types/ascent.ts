import { Temporal } from '@js-temporal/polyfill'
import { number, string, z } from 'zod'

const ratings = ['1*', '2*', '3*', '4*', '5*'] as const

const holds = [
  'Positive',
  'Jug',
  'Sloper',
  'Pocket',
  'Pinch',
  'Crimp',
  'Volume',
  'Crack',
  'Bi',
  'Mono',
  'Various',
  'Undercling',
] as const

const profiles = [
  'Dihedral',
  'Slab',
  'Vertical',
  'Overhang',
  'Arête',
  'Traverse',
  'Roof',
] as const

const heights = [
  '3m',
  '5m',
  '7m',
  '10m',
  '15m',
  '20m',
  '25m',
  '30m',
  '35m',
  '40m',
  '100m',
  '150m',
  '200m',
  '250m',
  '300m',
  '350m',
  '400m',
  '500m',
  '600m',
  '800m',
  '1000m',
] as const

const grades = [
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
] as const

const tries = [
  '001 Onsight',
  '01 Flash',
  '02 go',
  '03 go',
  '05 go',
  '10 go',
  '15 go',
  '20 go',
  '30 go',
  '50 go',
  '100 go',
] as const

export const GRADE_TO_NUMBER: Record<Grade, number> = {
  '6c': 5,
  '6c+': 6,
  '7a': 7,
  '7a+': 8,
  '7b': 9,
  '7b+': 10,
  '7c': 11,
  '7c+': 12,
  '8a': 13,
  '8a+': 14,
  '8b': 15,
  '8b+': 16,
} as const

export const gradeSchema = z.enum(grades)

export type Grade = z.infer<typeof gradeSchema>

const optionalStringSchema = string().optional()

export const ascentSchema = z.object({
  routeName: string().min(1).or(number()),
  topoGrade: gradeSchema,
  tries: z.enum(tries),
  personalGrade: gradeSchema.optional(),
  height: z.enum(heights).optional(),
  profile: z.enum(profiles).optional(),
  holds: z.enum(holds).optional(),
  rating: z.enum(ratings).optional(),
  routeOrBoulder: z.enum(['Route', 'Boulder']),
  crag: string(),
  area: z.union([string(), number()]).optional(),
  departement: optionalStringSchema,
  date: string().min(1).datetime()
    .transform(stringDate => {
      const d = new Date(stringDate)
      return Temporal.PlainDate.from(
        { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() },
        { overflow: 'reject' },
      )
    }),
  climber: string(),
  ascentComment: optionalStringSchema,
})

export type Ascent = z.infer<typeof ascentSchema>
