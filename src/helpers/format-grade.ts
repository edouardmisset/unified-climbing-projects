import type { Ascent, Grade } from '~/schema/ascent'

/**
 * @param params - The parameters for displaying the grade.
 * @param params.grade - The grade to display.
 * @param params.climbingDiscipline - The climbing discipline.
 * @returns The formatted grade string.
 */
interface FormatGradeParams {
  grade: Grade
  climbingDiscipline: Ascent['climbingDiscipline']
}

/**
 * Displays the grade based on the climbing discipline.
 * For bouldering, the grade is displayed in uppercase.
 * For other disciplines, the grade is displayed as is.
 *
 * @param params - The parameters for displaying the grade.
 * @returns The formatted grade string.
 */
export function formatGrade(params: FormatGradeParams): string {
  const { climbingDiscipline, grade } = params
  return climbingDiscipline === 'Boulder' ? grade.toUpperCase() : grade
}
