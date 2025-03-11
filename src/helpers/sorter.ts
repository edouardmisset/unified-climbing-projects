import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { fromGradeToNumber } from './grade-converter.ts'

export const sortByDescendingGrade = (
  { topoGrade: aGrade }: Ascent,
  { topoGrade: bGrade }: Ascent,
): number => fromGradeToNumber(bGrade) - fromGradeToNumber(aGrade)

const SESSION_TYPE_TO_SORT_ORDER: Record<
  Required<TrainingSession>['sessionType'],
  number
> = {
  Out: 1,
  CS: 2,
  MS: 2,
  Po: 2,
  PE: 3,
  En: 3,
  SE: 3,
  Sk: 4,
  St: 5,
  Ta: 6,
  FB: 7,
  Ro: 7,
  Co: 7,
  Sg: 7,
}

export const fromSessionTypeToSortOrder = (
  sessionType: Required<TrainingSession>['sessionType'],
): number => SESSION_TYPE_TO_SORT_ORDER[sessionType]
