import { z } from '~/helpers/zod'
import {
  type AscentDomain,
  type AscentRecord,
  ASCENT_GRADES,
  ASCENT_HOLDS,
  ASCENT_PROFILES,
  ASCENT_STYLES,
  ascentDomainSchema,
  ascentPublicOutputSchema,
  ascentStoredDocumentSchema,
} from './ascent'
import { toParisCalendarDate } from './calendar-date'
import {
  nonEmptyStringSchema,
  nonNegativeIntegerSchema,
  percentSchema,
  positiveIntegerSchema,
} from './common'
import {
  type TrainingSessionDomain,
  type TrainingSessionRecord,
  trainingSessionDomainSchema,
  trainingSessionPublicOutputSchema,
  trainingSessionStoredDocumentSchema,
} from './training-session'

const LEGACY_DISCIPLINES = ['Route', 'Boulder', 'Multi-Pitch'] as const
const LEGACY_SESSION_TYPES = [
  'Out',
  'CS',
  'Po',
  'MS',
  'En',
  'PE',
  'SE',
  'Ro',
  'FB',
  'Co',
  'Sg',
  'Sk',
  'St',
  'Ta',
] as const
const LEGACY_ANATOMICAL_REGIONS = ['Ar', 'Fi', 'Ge'] as const
const LEGACY_ENERGY_SYSTEMS = ['AA', 'AL', 'AE'] as const
const MAX_ASCENT_RATING = 5

const legacyDisciplineSchema = z.enum(LEGACY_DISCIPLINES)
const legacySessionTypeSchema = z.enum(LEGACY_SESSION_TYPES)
const legacyAnatomicalRegionSchema = z.enum(LEGACY_ANATOMICAL_REGIONS)
const legacyEnergySystemSchema = z.enum(LEGACY_ENERGY_SYSTEMS)

export const legacyAscentSchema = z
  .object({
    _creationTime: z.number().min(0).optional(),
    _id: nonEmptyStringSchema,
    area: z.string().optional(),
    climber: z.string().optional(),
    climbingDiscipline: legacyDisciplineSchema,
    comments: z.string().optional(),
    crag: nonEmptyStringSchema,
    date: nonEmptyStringSchema,
    height: nonNegativeIntegerSchema.optional(),
    holds: z.enum(ASCENT_HOLDS).optional(),
    personalGrade: z.enum(ASCENT_GRADES).optional(),
    points: nonNegativeIntegerSchema.optional(),
    profile: z.enum(ASCENT_PROFILES).optional(),
    rating: z.number().int().min(0).max(MAX_ASCENT_RATING).optional(),
    region: z.string().optional(),
    routeName: nonEmptyStringSchema,
    style: z.enum(ASCENT_STYLES),
    topoGrade: z.enum(ASCENT_GRADES),
    tries: positiveIntegerSchema,
  })
  .strict()

export const legacyTrainingSessionSchema = z
  .object({
    _creationTime: z.number().min(0).optional(),
    _id: nonEmptyStringSchema,
    anatomicalRegion: legacyAnatomicalRegionSchema.optional(),
    climbingDiscipline: legacyDisciplineSchema.optional(),
    comments: z.string().optional(),
    date: nonEmptyStringSchema,
    energySystem: legacyEnergySystemSchema.optional(),
    gymCrag: z.string().optional(),
    intensity: percentSchema.optional(),
    load: percentSchema.optional(),
    sessionType: legacySessionTypeSchema.optional(),
    volume: percentSchema.optional(),
  })
  .strict()

const DISCIPLINE_MAP = {
  Boulder: 'Bouldering',
  'Multi-Pitch': 'Multi-Pitch',
  Route: 'Sport',
} as const satisfies Record<(typeof LEGACY_DISCIPLINES)[number], AscentDomain['discipline']>

const SESSION_TYPE_MAP = {
  Co: 'Core',
  CS: 'Contact Strength',
  En: 'Endurance',
  FB: 'Finger Board',
  MS: 'Max Strength',
  Out: 'Outdoor',
  PE: 'Power Endurance',
  Po: 'Power',
  Ro: 'Routine',
  SE: 'Strength Endurance',
  Sg: 'Stretching',
  Sk: 'Skill',
  St: 'Stamina',
  Ta: 'Chill',
} as const satisfies Record<(typeof LEGACY_SESSION_TYPES)[number], TrainingSessionDomain['type']>

const ANATOMICAL_REGION_MAP = {
  Ar: 'Arms',
  Fi: 'Fingers',
  Ge: 'General',
} as const satisfies Record<
  (typeof LEGACY_ANATOMICAL_REGIONS)[number],
  NonNullable<TrainingSessionDomain['anatomicalRegion']>
>

const ENERGY_SYSTEM_MAP = {
  AA: 'Anaerobic Alactic',
  AE: 'Aerobic',
  AL: 'Anaerobic Lactic',
} as const satisfies Record<
  (typeof LEGACY_ENERGY_SYSTEMS)[number],
  NonNullable<TrainingSessionDomain['energySystem']>
>

const CANONICAL_DISCIPLINE_MAP = {
  Bouldering: 'Boulder',
  'Multi-Pitch': 'Multi-Pitch',
  Sport: 'Route',
} as const satisfies Record<AscentDomain['discipline'], (typeof LEGACY_DISCIPLINES)[number]>

export function toCanonicalDiscipline(
  discipline: (typeof LEGACY_DISCIPLINES)[number],
): AscentDomain['discipline'] {
  return DISCIPLINE_MAP[discipline]
}

export function toLegacyDiscipline(
  discipline: AscentDomain['discipline'],
): (typeof LEGACY_DISCIPLINES)[number] {
  return CANONICAL_DISCIPLINE_MAP[discipline]
}

export function toCanonicalAnatomicalRegion(
  region: (typeof LEGACY_ANATOMICAL_REGIONS)[number],
): NonNullable<TrainingSessionDomain['anatomicalRegion']> {
  return ANATOMICAL_REGION_MAP[region]
}

export function toCanonicalEnergySystem(
  energySystem: (typeof LEGACY_ENERGY_SYSTEMS)[number],
): NonNullable<TrainingSessionDomain['energySystem']> {
  return ENERGY_SYSTEM_MAP[energySystem]
}

export type CanonicalTransformation<T> = {
  id: string
  value: T
  wasCanonical: boolean
}

function removeUndefinedValues(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined),
  )
}

function normalizeOptionalText(value: string | undefined): string | undefined {
  return value?.trim() ? value : undefined
}

function selectCanonicalAscent(record: AscentDomain): AscentDomain {
  return ascentDomainSchema.parse(
    removeUndefinedValues({
      area: record.area,
      comments: record.comments,
      crag: record.crag,
      date: record.date,
      discipline: record.discipline,
      grade: record.grade,
      height: record.height,
      holds: record.holds,
      name: record.name,
      personalGrade: record.personalGrade,
      profile: record.profile,
      rating: record.rating,
      style: record.style,
      tries: record.tries,
    }),
  )
}

function selectCanonicalTrainingSession(record: TrainingSessionDomain): TrainingSessionDomain {
  return trainingSessionDomainSchema.parse(
    removeUndefinedValues({
      anatomicalRegion: record.anatomicalRegion,
      comments: record.comments,
      date: record.date,
      discipline: record.discipline,
      energySystem: record.energySystem,
      intensity: record.intensity,
      location: record.location,
      type: record.type,
      volume: record.volume,
    }),
  )
}

export function transformLegacyAscent(input: unknown): CanonicalTransformation<AscentDomain> {
  const canonicalRecord = ascentStoredDocumentSchema.safeParse(input)
  if (canonicalRecord.success)
    return {
      id: canonicalRecord.data._id,
      value: selectCanonicalAscent(canonicalRecord.data),
      wasCanonical: true,
    }

  const canonicalPublicRecord = ascentPublicOutputSchema.safeParse(input)
  if (canonicalPublicRecord.success)
    return {
      id: canonicalPublicRecord.data._id,
      value: selectCanonicalAscent(canonicalPublicRecord.data),
      wasCanonical: true,
    }

  const legacyRecord = legacyAscentSchema.parse(input)
  const comments =
    legacyRecord.comments === 'DWS'
      ? 'Deep Water Soloing'
      : normalizeOptionalText(legacyRecord.comments)

  const value = ascentDomainSchema.parse(
    removeUndefinedValues({
      area: normalizeOptionalText(legacyRecord.area),
      comments,
      crag: legacyRecord.crag,
      date: toParisCalendarDate(legacyRecord.date),
      discipline: DISCIPLINE_MAP[legacyRecord.climbingDiscipline],
      grade: legacyRecord.topoGrade,
      height: legacyRecord.height,
      holds: legacyRecord.holds,
      name: legacyRecord.routeName,
      personalGrade: legacyRecord.personalGrade,
      profile: legacyRecord.profile,
      rating: legacyRecord.rating,
      style: legacyRecord.style,
      tries: legacyRecord.tries,
    }),
  )

  return { id: legacyRecord._id, value, wasCanonical: false }
}

export function transformLegacyTrainingSession(
  input: unknown,
): CanonicalTransformation<TrainingSessionDomain> {
  const canonicalRecord = trainingSessionStoredDocumentSchema.safeParse(input)
  if (canonicalRecord.success)
    return {
      id: canonicalRecord.data._id,
      value: selectCanonicalTrainingSession(canonicalRecord.data),
      wasCanonical: true,
    }

  const canonicalPublicRecord = trainingSessionPublicOutputSchema.safeParse(input)
  if (canonicalPublicRecord.success)
    return {
      id: canonicalPublicRecord.data._id,
      value: selectCanonicalTrainingSession(canonicalPublicRecord.data),
      wasCanonical: true,
    }

  const legacyRecord = legacyTrainingSessionSchema.parse(input)
  const value = trainingSessionDomainSchema.parse(
    removeUndefinedValues({
      anatomicalRegion: legacyRecord.anatomicalRegion
        ? ANATOMICAL_REGION_MAP[legacyRecord.anatomicalRegion]
        : undefined,
      comments: normalizeOptionalText(legacyRecord.comments),
      date: toParisCalendarDate(legacyRecord.date),
      discipline: legacyRecord.climbingDiscipline
        ? DISCIPLINE_MAP[legacyRecord.climbingDiscipline]
        : undefined,
      energySystem: legacyRecord.energySystem
        ? ENERGY_SYSTEM_MAP[legacyRecord.energySystem]
        : undefined,
      intensity: legacyRecord.intensity,
      location: normalizeOptionalText(legacyRecord.gymCrag),
      type: legacyRecord.sessionType ? SESSION_TYPE_MAP[legacyRecord.sessionType] : undefined,
      volume: legacyRecord.volume,
    }),
  )

  return { id: legacyRecord._id, value, wasCanonical: false }
}

export function toCanonicalAscentRecord(input: unknown): AscentRecord {
  const { id, value } = transformLegacyAscent(input)
  return { ...value, _id: id }
}

export function toCanonicalTrainingSessionRecord(input: unknown): TrainingSessionRecord {
  const { id, value } = transformLegacyTrainingSession(input)
  return { ...value, _id: id }
}
