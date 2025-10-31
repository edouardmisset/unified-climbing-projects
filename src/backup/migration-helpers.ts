import { z } from '~/helpers/zod'

const _GRADES = [
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

const gradeSchema = z.enum(_GRADES)

const ASCENT_STYLE = ['Onsight', 'Flash', 'Redpoint'] as const
const CLIMBING_DISCIPLINE = ['Sport', 'Bouldering', 'Multi-Pitch'] as const
const climbingDisciplineSchema = z.enum(CLIMBING_DISCIPLINE)
const HOLDS = [
  'Crimp',
  'Jug',
  'Pocket',
  'Sloper',
  'Pinch',
  'Crack',
  'Undercling',
] as const
const PROFILES = [
  'Vertical',
  'Overhang',
  'Slab',
  'Roof',
  'Arête',
  'Dihedral',
  'Traverse',
] as const

const ascentStyleSchema = z.enum(ASCENT_STYLE)
const profileSchema = z.enum(PROFILES)
const holdsSchema = z.enum(HOLDS)
const optionalStringSchema = z.string().optional()

export const oldAscentSchema = z.object({
  area: z.string().trim().optional(),
  climber: z
    .string()
    .transform(() => 'Edouard Misset')
    .optional(),
  climbingDiscipline: climbingDisciplineSchema,
  comments: optionalStringSchema,
  crag: z.string().trim().min(1),
  date: z.string(), // ISO 8601 date format
  height: z.number().int().positive().optional(),
  holds: holdsSchema.optional(),
  _id: z.string(),
  personalGrade: gradeSchema.optional(),
  points: z.number().int().positive().optional(),
  profile: profileSchema.optional(),
  rating: z.number().int().min(0).max(5).optional(),
  region: optionalStringSchema,
  routeName: z.string().trim().min(1).default('No Name'),
  style: ascentStyleSchema,
  topoGrade: gradeSchema,
  tries: z.number().int().min(1),
})
