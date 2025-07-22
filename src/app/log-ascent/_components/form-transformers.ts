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

// Use the inferred types from Zod schemas
export type { InternalFormData } from '../types.ts'
export type ActionFormData = AscentFormOutput

// Transform external data to internal form format
export function toInternalFormData(
  data: Partial<AscentFormInput>,
  minGrade: Grade,
): InternalFormData {
  const {
    date,
    routeName,
    climbingDiscipline,
    crag,
    area,
    tries,
    style,
    topoGrade,
    personalGrade,
    holds,
    profile,
    height,
    rating,
    comments,
  } = data

  return {
    date: fromDateToStringDate(date ?? new Date()),
    routeName: String(routeName ?? ''),
    climbingDiscipline,
    crag: crag ?? '',
    area: area?.toString(),
    tries: tries ?? '1',
    style,
    topoGrade: topoGrade ?? fromGradeToNumber(minGrade),
    personalGrade: personalGrade ?? fromGradeToNumber(minGrade),
    holds: holds ?? '',
    profile: profile ?? '',
    height: height?.toString() ?? '',
    rating: rating?.toString() ?? '',
    comments,
  }
}

// Transform internal form data to external format (for the action/schema)
export function fromInternalFormData(data: InternalFormData): ActionFormData {
  const {
    date,
    routeName,
    climbingDiscipline,
    crag,
    area,
    tries,
    style,
    topoGrade,
    personalGrade,
    holds,
    profile,
    height,
    rating,
    comments,
  } = data

  return {
    date, // Keep as string - schema expects string
    routeName: String(routeName ?? ''),
    climbingDiscipline: climbingDiscipline ?? 'Route',
    crag: crag ?? '',
    area,
    tries: String(tries ?? '1'),
    style: style ?? 'Redpoint',
    topoGrade,
    personalGrade,
    holds: holds ?? '',
    profile: profile ?? '',
    height: height ?? '', // Always send string, empty for undefined/null
    rating: rating ?? '', // Always send string, empty for undefined/null
    comments,
  }
}
