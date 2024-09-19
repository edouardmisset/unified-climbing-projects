import { Temporal } from '@js-temporal/polyfill'
import { number, string, z } from 'zod'
import { climbingDisciplineSchema } from './training'

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
  '5a',
  '5a+',
  '5b',
  '5b+',
  '5c',
  '5c+',

  '6a',
  '6a+',
  '6b',
  '6b+',
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
  '8c',
  '8c+',
] as const

export const GRADE_TO_NUMBER: Record<Grade, number> = {
  '5a': 1,
  '5a+': 2,
  '5b': 3,
  '5b+': 4,
  '5c': 5,
  '5c+': 6,

  '6a': 7,
  '6a+': 8,
  '6b': 9,
  '6b+': 10,
  '6c': 11,
  '6c+': 12,

  '7a': 13,
  '7a+': 14,
  '7b': 15,
  '7b+': 16,
  '7c': 17,
  '7c+': 18,

  '8a': 19,
  '8a+': 20,
  '8b': 21,
  '8b+': 22,
  '8c': 23,
  '8c+': 24,
} as const

export const gradeSchema = z.enum(grades)

export type Grade = z.infer<typeof gradeSchema>

const optionalStringSchema = string().optional()

const ascentStyle = ['Onsight', 'Flash', 'Redpoint'] as const

export const profileSchema = z.enum(profiles)
export const holdsSchema = z.enum(holds)

export const ascentSchema = z.object({
  area: string().or(number()).transform(String).optional(),
  climber: string()
    .optional()
    .transform(_s => 'Edouard Misset'),
  climbingDiscipline: climbingDisciplineSchema,
  comments: optionalStringSchema,
  crag: string().min(1),
  date: string()
    .min(1)
    .datetime()
    .transform(stringDate => {
      const d = new Date(stringDate)
      return Temporal.PlainDate.from(
        {
          day: d.getDate(),
          month: d.getMonth() + 1,
          year: d.getFullYear(),
        },
        { overflow: 'reject' },
      )
    }),
  region: optionalStringSchema,
  height: number().min(5).optional(),
  holds: holdsSchema.optional(),
  personalGrade: gradeSchema.optional(),
  profile: profileSchema.optional(),
  rating: number().min(0).max(5).optional(),
  routeName: string().min(1).or(number()).transform(String),
  style: z.enum(ascentStyle),
  topoGrade: gradeSchema,
  tries: number().min(1),
})

export type Ascent = z.infer<typeof ascentSchema>
