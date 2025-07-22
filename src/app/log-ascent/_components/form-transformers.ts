import { fromDateToStringDate } from '~/helpers/date.ts'
import { fromGradeToNumber } from '~/helpers/grade-converter.ts'
import type { Grade } from '~/schema/ascent'
import type {
  AscentFormInput,
  AscentFormOutput,
  InternalFormData,
} from '../types.ts'

/**
 * Centralized data transformation layer
 * Handles all conversions between internal form state and external data formats
 */

// Shared default values for consistent bidirectional transformations
const FORM_DEFAULTS = {
  climbingDiscipline: 'Route',
  crag: '',
  area: '',
  tries: '1',
  style: 'Redpoint',
  routeName: '',
  holds: '',
  profile: '',
  height: '',
  rating: '',
  date: fromDateToStringDate(new Date()),
  personalGrade: 1,
  topoGrade: 1,
  comments: '',
} as const satisfies InternalFormData

// Use the inferred types from Zod schemas
export type { InternalFormData } from '../types.ts'
export type ActionFormData = AscentFormOutput

// Transform external data to internal form format
export function toInternalFormData(
  data: Partial<AscentFormInput>,
  minGrade: Grade,
): InternalFormData {
  const {
    date = new Date(),
    routeName = FORM_DEFAULTS.routeName,
    climbingDiscipline = FORM_DEFAULTS.climbingDiscipline,
    crag = FORM_DEFAULTS.crag,
    area = FORM_DEFAULTS.area,
    tries = FORM_DEFAULTS.tries,
    style = FORM_DEFAULTS.style,
    topoGrade,
    personalGrade,
    holds = FORM_DEFAULTS.holds,
    profile = FORM_DEFAULTS.profile,
    height = FORM_DEFAULTS.height,
    rating = FORM_DEFAULTS.rating,
    comments = FORM_DEFAULTS.comments,
  } = data

  return {
    date: fromDateToStringDate(date),
    routeName: String(routeName),
    climbingDiscipline,
    crag,
    area: area?.toString() ?? FORM_DEFAULTS.area,
    tries,
    style,
    topoGrade: topoGrade ?? fromGradeToNumber(minGrade),
    personalGrade: personalGrade ?? fromGradeToNumber(minGrade),
    holds,
    profile,
    height: height?.toString() ?? FORM_DEFAULTS.height,
    rating: rating?.toString() ?? FORM_DEFAULTS.rating,
    comments,
  }
}

// Transform internal form data to external format (for the action/schema)
export function fromInternalFormData(data: InternalFormData): ActionFormData {
  const {
    date = FORM_DEFAULTS.date,
    routeName = FORM_DEFAULTS.routeName,
    climbingDiscipline = FORM_DEFAULTS.climbingDiscipline,
    crag = FORM_DEFAULTS.crag,
    area = FORM_DEFAULTS.area,
    tries = FORM_DEFAULTS.tries,
    style = FORM_DEFAULTS.style,
    topoGrade,
    personalGrade,
    holds = FORM_DEFAULTS.holds,
    profile = FORM_DEFAULTS.profile,
    height = FORM_DEFAULTS.height,
    rating = FORM_DEFAULTS.rating,
    comments = FORM_DEFAULTS.comments,
  } = data

  return {
    date, // Keep as string - schema expects string
    routeName: String(routeName),
    climbingDiscipline,
    crag,
    area,
    tries: String(tries),
    style,
    topoGrade,
    personalGrade,
    holds,
    profile,
    height,
    rating,
    comments,
  }
}
