import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { fromGradeToNumber } from './grade-converter.ts'

/**
 * Sorts two ascents based on their topo grades.
 *
 * The function converts each ascent's topo grade to a numeric value using
 * `fromGradeToNumber` and computes the difference. The optional `descending`
 * flag controls whether the sorting is in descending order (default) or
 * ascending order.
 *
 * @param {Ascent} firstAscent - The first ascent object containing a `topoGrade`.
 * @param {Ascent} secondAscent - The second ascent object containing a `topoGrade`.
 * @param {{ descending?: boolean }} [options] - Optional sorting options.
 * @returns {number} A negative value if the first ascent should come before the second,
 * zero if equal, or a positive value otherwise.
 */
export function sortByGrade(
  { topoGrade: aGrade }: Ascent,
  { topoGrade: bGrade }: Ascent,
  options?: { descending: boolean },
): number {
  const { descending = true } = options ?? {}
  return aGrade === bGrade
    ? 0
    : (fromGradeToNumber(bGrade) - fromGradeToNumber(aGrade)) *
        (descending ? 1 : -1)
}

/**
 * Maps a training session type to its sort order.
 *
 * The function returns a numeric value representing the sort order for a given
 * training session type, according to a predefined mapping.
 *
 * @param {Required<TrainingSession>['sessionType']} sessionType - The training
 * session type.
 * @returns {number} The sort order associated with the provided session type.
 */
export const fromSessionTypeToSortOrder = (
  sessionType: Required<TrainingSession>['sessionType'],
): number => SESSION_TYPE_TO_SORT_ORDER[sessionType]

const SESSION_TYPE_TO_SORT_ORDER: Record<
  Required<TrainingSession>['sessionType'],
  number
> = {
  Co: 7,
  CS: 2,
  En: 3,
  FB: 7,
  MS: 2,
  Out: 1,
  PE: 3,
  Po: 2,
  Ro: 7,
  SE: 3,
  Sg: 7,
  Sk: 4,
  St: 5,
  Ta: 6,
}
