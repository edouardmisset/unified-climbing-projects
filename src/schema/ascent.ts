import { Temporal } from '@js-temporal/polyfill'
import { number, string, z } from 'zod'

export const _GRADES = [
  '1a',
  '1a+',
  '1b',
  '1b+',
  '1c',
  '1c+',

  '2a',
  '2a+',
  '2b',
  '2b+',
  '2c',
  '2c+',

  '3a',
  '3a+',
  '3b',
  '3b+',
  '3c',
  '3c+',

  '4a',
  '4a+',
  '4b',
  '4b+',
  '4c',
  '4c+',

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

  '9a',
  '9a+',
  '9b',
  '9b+',
  '9c',
  '9c+',
] as const

export const GRADE_TO_NUMBER = {
  '1a': 1,
  '1a+': 2,
  '1b': 3,
  '1b+': 4,
  '1c': 5,
  '1c+': 6,

  '2a': 7,
  '2a+': 8,
  '2b': 9,
  '2b+': 10,
  '2c': 11,
  '2c+': 12,

  '3a': 13,
  '3a+': 14,
  '3b': 15,
  '3b+': 16,
  '3c': 17,
  '3c+': 18,

  '4a': 19,
  '4a+': 20,
  '4b': 21,
  '4b+': 22,
  '4c': 23,
  '4c+': 24,

  '5a': 25,
  '5a+': 26,
  '5b': 27,
  '5b+': 28,
  '5c': 29,
  '5c+': 30,

  '6a': 31,
  '6a+': 32,
  '6b': 33,
  '6b+': 34,
  '6c': 35,
  '6c+': 36,

  '7a': 37,
  '7a+': 38,
  '7b': 39,
  '7b+': 40,
  '7c': 41,
  '7c+': 42,

  '8a': 43,
  '8a+': 44,
  '8b': 45,
  '8b+': 46,
  '8c': 47,
  '8c+': 48,

  '9a': 49,
  '9a+': 50,
  '9b': 51,
  '9b+': 52,
  '9c': 53,
  '9c+': 54,
} as const satisfies Record<Grade, number>

export const gradeSchema = z.enum(_GRADES)

export type Grade = z.infer<typeof gradeSchema>
export type BoulderGrade = Uppercase<Grade>

const ascentStyle = ['Onsight', 'Flash', 'Redpoint'] as const
export const climbingDisciplineSchema = z.enum([
  'Route',
  'Boulder',
  'Multi-Pitch',
])

export const holdsFromGS = [
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

/**
 * 'Mono' and 'Bi' hold types from Google Sheets' model are really only pockets.
 *
 * 'Various' was a catch-all for holds that don't fit in the other categories,
 * but it's not very useful. It is likely to be crimpy holds.
 *
 * 'Positive' and Volume are a hold type that don't really exist in outdoor climbing.
 */
export const holds = [
  'Crimp',
  'Jug',
  'Pocket',
  'Sloper',
  'Pinch',
  'Crack',
  'Undercling',
] as const

export const profiles = [
  'Vertical',
  'Overhang',
  'Slab',
  'Roof',
  'Arête',
  'Dihedral',
  'Traverse',
] as const

export const profileSchema = z.enum(profiles)
export const holdsFomGSSchema = z.enum(holdsFromGS)
export const holdsSchema = z.enum(holds)
const optionalStringSchema = string().optional()

export const ascentSchema = z.object({
  area: string().or(number()).transform(String).optional(),
  climber: string()
    .transform(_ => 'Edouard Misset')
    .optional(),
  climbingDiscipline: climbingDisciplineSchema,
  comments: optionalStringSchema,
  crag: string().min(1),
  date: string() // ISO 8601 date format
    .datetime()
    .transform(stringDate => {
      const d = new Date(stringDate)
      return Temporal.PlainDateTime.from(
        {
          day: d.getDate(),
          month: d.getMonth() + 1,
          year: d.getFullYear(),
        },
        { overflow: 'reject' },
      )
    }),
  region: optionalStringSchema,
  height: number().min(0).optional(),
  holds: holdsSchema.optional(),
  personalGrade: gradeSchema.optional(),
  profile: profileSchema.optional(),
  rating: number().int().min(0).max(5).optional(),
  routeName: string().min(1).or(number()).transform(String).default('No Name'),
  style: z.enum(ascentStyle),
  topoGrade: gradeSchema,
  tries: number().int().min(1),
  id: number().min(0),
})
export type Ascent = z.infer<typeof ascentSchema>
