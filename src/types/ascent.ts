import { Temporal } from '@js-temporal/polyfill'
import { number, string, z } from 'zod'

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

export const profileSchema = z.enum(profiles)
export const holdsSchema = z.enum(holds)

export const ascentSchema = z.object({
  routeName: string().min(1).or(number()),
  topoGrade: gradeSchema,
  tries: number(),
  personalGrade: gradeSchema.optional(),
  height: number().optional(),
  profile: profileSchema.optional(),
  holds: holdsSchema.optional(),
  rating: number().optional(),
  routeOrBoulder: z.enum(['Route', 'Boulder']),
  crag: string(),
  area: z.union([string(), number()]).optional(),
  departement: optionalStringSchema,
  date: string()
    .min(1)
    .datetime()
    .transform(stringDate => {
      const d = new Date(stringDate)
      return Temporal.PlainDate.from(
        { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() },
        { overflow: 'reject' },
      )
    }),
  climber: string(),
  comments: optionalStringSchema,
  style: z.enum(['Onsight', 'Flash', 'Redpoint'])
})

export type Ascent = z.infer<typeof ascentSchema>
