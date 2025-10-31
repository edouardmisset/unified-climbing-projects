import { objectKeys } from '@edouardmisset/object'
import { getDateAtNoon } from '~/helpers/date.ts'
import { emptyStringToUndefined } from '~/helpers/empty-string-to-undefined.ts'
import { z } from '~/helpers/zod'
import { climbingDisciplineSchema } from './ascent.ts'
import { percentSchema } from './generic.ts'

/** emoji representation of the string */
type Emoji = { emoji: string }

/** short text representation of the string */
type ShortText = { shortText: string }

type SessionType = {
  /** category of the training session type */
  category: string
  color: string
  order: number
}

export const OUTDOOR = 'Outdoor' as const

export const SESSION_TYPE = {
  [OUTDOOR]: {
    shortText: 'Out',
    category: 'outdoor',
    color: 'var(--outdoor)',
    order: 1,
  },

  'Contact Strength': {
    shortText: 'CS',
    category: 'strength',
    color: 'var(--strength)',
    order: 2,
  },
  Power: {
    shortText: 'Po',
    category: 'strength',
    color: 'var(--strength)',
    order: 2,
  },
  'Max Strength': {
    shortText: 'MS',
    category: 'strength',
    color: 'var(--strength)',
    order: 2,
  },

  Endurance: {
    shortText: 'En',
    category: 'endurance',
    color: 'var(--endurance)',
    order: 3,
  },
  'Power Endurance': {
    shortText: 'PE',
    category: 'endurance',
    color: 'var(--endurance)',
    order: 3,
  },
  'Strength Endurance': {
    shortText: 'SE',
    category: 'endurance',
    color: 'var(--endurance)',
    order: 3,
  },

  Routine: {
    shortText: 'Ro',
    category: 'otherTraining',
    color: 'var(--otherTraining)',
    order: 7,
  },
  'Finger Board': {
    shortText: 'FB',
    category: 'otherTraining',
    color: 'var(--otherTraining)',
    order: 7,
  },
  Core: {
    shortText: 'Co',
    category: 'otherTraining',
    color: 'var(--otherTraining)',
    order: 7,
  },
  Stretching: {
    shortText: 'Sg',
    category: 'otherTraining',
    color: 'var(--otherTraining)',
    order: 7,
  },

  Skill: {
    shortText: 'Sk',
    category: 'stamina',
    color: 'var(--stamina)',
    order: 4,
  },
  Stamina: {
    shortText: 'St',
    category: 'stamina',
    color: 'var(--stamina)',
    order: 5,
  },

  Chill: {
    shortText: 'Ch',
    category: 'chill',
    color: 'var(--chill)',
    order: 6,
  },
} as const satisfies Record<string, SessionType & ShortText>

export const ANATOMICAL_REGION = {
  Arms: { shortText: 'Ar', emoji: '💪' },
  Fingers: { shortText: 'Fi', emoji: '🖐️' },
  General: { shortText: 'Ge', emoji: '🦵' },
} as const satisfies Record<string, ShortText & Emoji>

export const ENERGY_SYSTEM = {
  'Anaerobic Alactic': { shortText: 'AA', emoji: '🔥' },
  Aerobic: { shortText: 'AE', emoji: '🏃‍♂️' },
  'Anaerobic Lactic': { shortText: 'AL', emoji: '🪫' },
} as const satisfies Record<string, ShortText & Emoji>

export const LOAD_CATEGORIES = ['High', 'Medium', 'Low'] as const
export const loadCategorySchema = z.enum(LOAD_CATEGORIES)
export type LoadCategory = z.infer<typeof loadCategorySchema>

export const SESSION_TYPES = objectKeys(SESSION_TYPE)
const sessionTypeSchema = z.enum(
  SESSION_TYPES as [
    keyof typeof SESSION_TYPE,
    ...(keyof typeof SESSION_TYPE)[],
  ],
)
export const ENERGY_SYSTEMS = objectKeys(ENERGY_SYSTEM)
const energySystemSchema = z.enum(
  ENERGY_SYSTEMS as [
    keyof typeof ENERGY_SYSTEM,
    ...(keyof typeof ENERGY_SYSTEM)[],
  ],
)
export const ANATOMICAL_REGIONS = objectKeys(ANATOMICAL_REGION)
const anatomicalRegionSchema = z.enum(
  ANATOMICAL_REGIONS as [
    keyof typeof ANATOMICAL_REGION,
    ...(keyof typeof ANATOMICAL_REGION)[],
  ],
)

export const trainingSessionSchema = z.object({
  anatomicalRegion: anatomicalRegionSchema.optional(),
  discipline: climbingDisciplineSchema.optional(),
  comments: z.string().optional(),
  date: z.string().transform(date => new Date(date).toISOString()), // ISO 8601 date format
  energySystem: energySystemSchema.optional(),
  location: z.string().optional(),
  _id: z.string(),
  intensity: percentSchema.optional(),
  type: sessionTypeSchema.optional(),
  volume: percentSchema.optional(),
})
export type TrainingSession = z.infer<typeof trainingSessionSchema>

export const trainingSessionFormSchema = z.object({
  anatomicalRegion: z.preprocess(
    emptyStringToUndefined,
    anatomicalRegionSchema.optional(),
  ),
  climbingDiscipline: z.preprocess(
    emptyStringToUndefined,
    climbingDisciplineSchema.optional(),
  ),
  comments: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  date: z
    .string()
    .trim()
    .transform(date => getDateAtNoon(new Date(date)).toISOString()),
  energySystem: z.preprocess(
    emptyStringToUndefined,
    energySystemSchema.optional(),
  ),
  location: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  intensity: z.preprocess(
    (v: unknown) => (v === '' ? undefined : Number(v)),
    percentSchema.optional(),
  ),
  type: z.preprocess(emptyStringToUndefined, sessionTypeSchema.optional()),
  volume: z.preprocess(
    (v: unknown) => (v === '' ? undefined : Number(v)),
    percentSchema.optional(),
  ),
})
export type TrainingSessionForm = z.infer<typeof trainingSessionFormSchema>

export type TrainingSessionListProps = {
  trainingSessions: TrainingSession[]
}
