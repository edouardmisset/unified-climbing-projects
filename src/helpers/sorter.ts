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
 * @param {Ascent} firstAscent - The first ascent object containing a `grade`.
 * @param {Ascent} secondAscent - The second ascent object containing a `grade`.
 * @param {{ descending?: boolean }} [options] - Optional sorting options.
 * @returns {number} A negative value if the first ascent should come before the second,
 * zero if equal, or a positive value otherwise.
 */
export function sortByGrade(
  { grade: aGrade }: Ascent,
  { grade: bGrade }: Ascent,
  options?: { descending: boolean },
): number {
  const { descending = true } = options ?? {}
  return aGrade === bGrade
    ? 0
    : (fromGradeToNumber(bGrade) - fromGradeToNumber(aGrade)) * (descending ? 1 : -1)
}

/**
 * Maps a training session type to its sort order.
 *
 * The function returns a numeric value representing the sort order for a given
 * training session type, according to a predefined mapping.
 *
 * @param {Required<TrainingSession>['type']} type - The training
 * session type.
 * @returns {number} The sort order associated with the provided session type.
 */
export const fromSessionTypeToSortOrder = (type: Required<TrainingSession>['type']): number =>
  SESSION_TYPE_TO_SORT_ORDER[type]

const SESSION_TYPE_TO_SORT_ORDER: Record<Required<TrainingSession>['type'], number> = {
  Chill: 6,
  'Contact Strength': 2,
  Core: 7,
  Endurance: 3,
  'Finger Board': 7,
  'Max Strength': 2,
  Outdoor: 1,
  Power: 2,
  'Power Endurance': 3,
  Routine: 7,
  Skill: 4,
  Stamina: 5,
  'Strength Endurance': 3,
  Stretching: 7,
}
