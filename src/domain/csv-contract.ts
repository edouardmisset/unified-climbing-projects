import {
  ASCENT_CSV_COLUMNS,
  type AscentDomain,
  type AscentImportRow,
  ascentCsvRowCodec,
} from './ascent'
import { parseCanonicalCsv, serializeCanonicalCsv } from './csv'
import {
  TRAINING_SESSION_CSV_COLUMNS,
  type TrainingSessionDomain,
  type TrainingSessionImportRow,
  trainingSessionCsvRowCodec,
} from './training-session'

export const ASCENT_REQUIRED_CSV_COLUMNS = [
  'discipline',
  'name',
  'grade',
  'crag',
  'date',
  'style',
  'tries',
] as const satisfies readonly (typeof ASCENT_CSV_COLUMNS)[number][]

export const TRAINING_SESSION_REQUIRED_CSV_COLUMNS = [
  'date',
  'type',
] as const satisfies readonly (typeof TRAINING_SESSION_CSV_COLUMNS)[number][]

const ascentCsvContract = {
  columns: ASCENT_CSV_COLUMNS,
  requiredColumns: ASCENT_REQUIRED_CSV_COLUMNS,
  rowSchema: ascentCsvRowCodec,
} as const

const trainingSessionCsvContract = {
  columns: TRAINING_SESSION_CSV_COLUMNS,
  requiredColumns: TRAINING_SESSION_REQUIRED_CSV_COLUMNS,
  rowSchema: trainingSessionCsvRowCodec,
} as const

export const ASCENT_CSV_TEMPLATE = serializeCanonicalCsv([], ASCENT_CSV_COLUMNS)
export const TRAINING_SESSION_CSV_TEMPLATE = serializeCanonicalCsv([], TRAINING_SESSION_CSV_COLUMNS)

export function parseAscentCsv(text: string): AscentImportRow[] {
  return parseCanonicalCsv(text, ascentCsvContract)
}

export function parseTrainingSessionCsv(text: string): TrainingSessionImportRow[] {
  return parseCanonicalCsv(text, trainingSessionCsvContract)
}

export function serializeAscentsCsv(ascents: readonly AscentDomain[]): string {
  return serializeCanonicalCsv(
    ascents.map(ascent => ascentCsvRowCodec.encode(ascent)),
    ASCENT_CSV_COLUMNS,
  )
}

export function serializeTrainingSessionsCsv(sessions: readonly TrainingSessionDomain[]): string {
  return serializeCanonicalCsv(
    sessions.map(session => trainingSessionCsvRowCodec.encode(session)),
    TRAINING_SESSION_CSV_COLUMNS,
  )
}
