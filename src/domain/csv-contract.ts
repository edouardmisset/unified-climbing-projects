import {
  ASCENT_CSV_COLUMNS,
  type AscentDomain,
  type AscentExportRow,
  type AscentImportRow,
  ascentExportRowSchema,
  ascentImportRowSchema,
} from './ascent'
import { parseCanonicalCsv, serializeCanonicalCsv } from './csv'
import {
  TRAINING_SESSION_CSV_COLUMNS,
  type TrainingSessionDomain,
  type TrainingSessionExportRow,
  type TrainingSessionImportRow,
  trainingSessionExportRowSchema,
  trainingSessionImportRowSchema,
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
  rowSchema: ascentImportRowSchema,
} as const

const trainingSessionCsvContract = {
  columns: TRAINING_SESSION_CSV_COLUMNS,
  requiredColumns: TRAINING_SESSION_REQUIRED_CSV_COLUMNS,
  rowSchema: trainingSessionImportRowSchema,
} as const

export const ASCENT_CSV_TEMPLATE = serializeCanonicalCsv([], ASCENT_CSV_COLUMNS)
export const TRAINING_SESSION_CSV_TEMPLATE = serializeCanonicalCsv([], TRAINING_SESSION_CSV_COLUMNS)

export function parseAscentCsv(text: string): AscentImportRow[] {
  return parseCanonicalCsv(text, ascentCsvContract)
}

export function parseTrainingSessionCsv(text: string): TrainingSessionImportRow[] {
  return parseCanonicalCsv(text, trainingSessionCsvContract)
}

function toAscentExportRow(ascent: AscentDomain): AscentExportRow {
  return ascentExportRowSchema.parse({
    discipline: ascent.discipline,
    name: ascent.name,
    grade: ascent.grade,
    crag: ascent.crag,
    date: ascent.date,
    style: ascent.style,
    tries: String(ascent.tries),
    area: ascent.area ?? '',
    comments: ascent.comments ?? '',
    height: ascent.height === undefined ? '' : String(ascent.height),
    holds: ascent.holds ?? '',
    personalGrade: ascent.personalGrade ?? '',
    profile: ascent.profile ?? '',
    rating: ascent.rating === undefined ? '' : String(ascent.rating),
  })
}

function toTrainingSessionExportRow(session: TrainingSessionDomain): TrainingSessionExportRow {
  return trainingSessionExportRowSchema.parse({
    date: session.date,
    type: session.type,
    discipline: session.discipline ?? '',
    location: session.location ?? '',
    anatomicalRegion: session.anatomicalRegion ?? '',
    energySystem: session.energySystem ?? '',
    comments: session.comments ?? '',
    intensity: session.intensity === undefined ? '' : String(session.intensity),
    volume: session.volume === undefined ? '' : String(session.volume),
  })
}

export function serializeAscentsCsv(ascents: readonly AscentDomain[]): string {
  return serializeCanonicalCsv(
    ascents.map(ascent => toAscentExportRow(ascent)),
    ASCENT_CSV_COLUMNS,
  )
}

export function serializeTrainingSessionsCsv(sessions: readonly TrainingSessionDomain[]): string {
  return serializeCanonicalCsv(
    sessions.map(session => toTrainingSessionExportRow(session)),
    TRAINING_SESSION_CSV_COLUMNS,
  )
}
