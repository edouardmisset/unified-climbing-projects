import type { Ascent } from '~/schema/ascent'
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
  { grade: aGrade }: Ascent,
  { grade: bGrade }: Ascent,
  options?: { descending: boolean },
): number {
  const { descending = true } = options ?? {}
  return aGrade === bGrade
    ? 0
    : (fromGradeToNumber(bGrade) - fromGradeToNumber(aGrade)) *
        (descending ? 1 : -1)
}
