import { type Ascent, BOULDERING } from '~/schema/ascent'

/**
 * Formats the grade based on the climbing discipline.
 * For bouldering, the grade is displayed in uppercase.
 * For other disciplines, the grade is displayed as is.
 *
 * @param params - The parameters for displaying the grade.
 * @returns The formatted grade string.
 */
export function formatGrade(
  params: Pick<Ascent, 'discipline' | 'grade'>,
): string {
  const { discipline: climbingDiscipline, grade } = params
  return climbingDiscipline === BOULDERING ? grade.toUpperCase() : grade
}
