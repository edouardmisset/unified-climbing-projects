import { stringifyDate } from '@edouardmisset/date/stringify-date.ts'
import {
  ascentDisciplineSchema,
  ascentGradeSchema,
  ascentHoldsSchema,
  ascentProfileSchema,
  ascentStyleSchema,
  type AscentRecord,
} from '~/domain/ascent'
import {
  anatomicalRegionSchema,
  energySystemSchema,
  trainingSessionTypeSchema,
} from '~/domain/training-session'
import type { LogScope } from '~/domain/climbing-log'
import { z } from 'zod'

export const LOG_DRAFT_VERSION = 3
export const LOG_STEP_VALUES = ['general', 'training', 'ascents'] as const

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
    location: z.string(),
    hasTraining: z.boolean(),
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

type AscentHistoryDefaults = Pick<AscentRecord, 'area' | 'crag' | 'discipline' | 'grade'>

type CreateAscentDraftOptions = {
  defaultGrade?: AscentDraft['grade']
  discipline: LogDraft['discipline']
  historyDefaults?: AscentHistoryDefaults
}

export function createAscentDraft({
  defaultGrade,
  discipline,
  historyDefaults,
}: CreateAscentDraftOptions): AscentDraft {
  const grade = defaultGrade ?? historyDefaults?.grade ?? '6a'

  return {
    area: historyDefaults?.area ?? '',
    comments: '',
    discipline,
    grade,
    height: '',
    holds: '',
    name: '',
    personalGrade: grade,
    profile: '',
    rating: '',
    style: discipline === 'Bouldering' ? 'Flash' : 'Onsight',
    tries: '1',
  }
}

type CreateInitialLogDraftOptions = {
  defaultGrade?: AscentDraft['grade']
  defaultScope?: LogScope
  defaultTrainingEnergySystem?: LogDraft['training']['energySystem']
  defaultTrainingType?: LogDraft['training']['type']
  historyDefaults?: AscentHistoryDefaults
}

export function createInitialLogDraft({
  defaultGrade,
  defaultScope,
  defaultTrainingEnergySystem = '',
  defaultTrainingType = 'Outdoor',
  historyDefaults,
}: CreateInitialLogDraftOptions = {}): LogDraft {
  const discipline = historyDefaults?.discipline ?? 'Sport'
  return {
    ascents:
      defaultScope !== 'ascents' && defaultScope !== 'both'
        ? []
        : [createAscentDraft({ defaultGrade, discipline, historyDefaults })],
    date: stringifyDate(new Date()).data ?? '',
    discipline,
    location: historyDefaults?.crag ?? '',
    hasTraining: defaultScope === 'training' || defaultScope === 'both',
    training: {
      anatomicalRegion: '',
      comments: '',
      energySystem: defaultTrainingEnergySystem,
      intensity: '',
      type: defaultTrainingType,
      volume: '',
    },
  }
}
