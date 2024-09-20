import type { Ascent } from '~/types/ascent'
import type { TrainingSession } from '~/types/training'
import { convertGradeToNumber } from './converter'

export const sortByDescendingGrade = (
  { topoGrade: aGrade }: Ascent,
  { topoGrade: bGrade }: Ascent,
): number => convertGradeToNumber(bGrade) - convertGradeToNumber(aGrade)

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

export const convertSessionTypeToSortOrder = (
  sessionType: Required<TrainingSession>['sessionType'],
): number => SESSION_TYPE_TO_SORT_ORDER[sessionType]
