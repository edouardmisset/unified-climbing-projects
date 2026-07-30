import { stringifyDate } from '@edouardmisset/date/stringify-date.ts'
import {
  ascentDisciplineSchema,
  ascentGradeSchema,
  ascentHoldsSchema,
  ascentProfileSchema,
  ascentStyleSchema,
  type AscentRecord,
} from '~/domain/canonical/ascent'
import {
  anatomicalRegionSchema,
  energySystemSchema,
  trainingSessionTypeSchema,
} from '~/domain/canonical/training-session'
import { z } from '~/helpers/zod'

export const LOG_DRAFT_VERSION = 1
export const LOG_STEP_VALUES = ['common', 'training', 'ascents'] as const

const optionalDraftValue = <T extends z.ZodType>(schema: T) => z.union([z.literal(''), schema])

const trainingDraftSchema = z
  .object({
    anatomicalRegion: optionalDraftValue(anatomicalRegionSchema),
    comments: z.string(),
    energySystem: optionalDraftValue(energySystemSchema),
    intensity: z.string(),
    type: optionalDraftValue(trainingSessionTypeSchema),
    volume: z.string(),
  })
  .strict()

const ascentDraftSchema = z
  .object({
    area: z.string(),
    comments: z.string(),
    discipline: ascentDisciplineSchema,
    grade: ascentGradeSchema,
    height: z.string(),
    holds: optionalDraftValue(ascentHoldsSchema),
    name: z.string(),
    personalGrade: optionalDraftValue(ascentGradeSchema),
    profile: optionalDraftValue(ascentProfileSchema),
    rating: z.string(),
    style: ascentStyleSchema,
    tries: z.string(),
  })
  .strict()

export const logDraftSchema = z
  .object({
    ascents: ascentDraftSchema.array(),
    date: z.string(),
    discipline: ascentDisciplineSchema,
    includeTraining: z.boolean(),
    location: z.string(),
    training: trainingDraftSchema,
  })
  .strict()

export const persistedLogDraftSchema = z
  .object({
    savedAt: z.number().int().nonnegative(),
    values: logDraftSchema,
    version: z.literal(LOG_DRAFT_VERSION),
  })
  .strict()

export type AscentDraft = z.infer<typeof ascentDraftSchema>
export type LogDraft = z.infer<typeof logDraftSchema>
export type LogStep = (typeof LOG_STEP_VALUES)[number]

export function createAscentDraft(
  discipline: LogDraft['discipline'],
  latestAscent?: AscentRecord,
): AscentDraft {
  return {
    area: latestAscent?.area ?? '',
    comments: '',
    discipline,
    grade: latestAscent?.grade ?? '6a',
    height: '',
    holds: '',
    name: '',
    personalGrade: latestAscent?.personalGrade ?? latestAscent?.grade ?? '6a',
    profile: '',
    rating: '',
    style: discipline === 'Bouldering' ? 'Flash' : 'Onsight',
    tries: '1',
  }
}

export function createInitialLogDraft(latestAscent?: AscentRecord): LogDraft {
  const discipline = latestAscent?.discipline ?? 'Sport'
  return {
    ascents: [],
    date: stringifyDate(new Date()).data ?? '',
    discipline,
    includeTraining: false,
    location: latestAscent?.crag ?? '',
    training: {
      anatomicalRegion: '',
      comments: '',
      energySystem: '',
      intensity: '',
      type: 'Outdoor',
      volume: '',
    },
  }
}
