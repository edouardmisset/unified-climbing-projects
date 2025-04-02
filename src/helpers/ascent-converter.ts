import { ASCENT_GRADE_TO_COLOR } from '~/constants/ascents'
import {
  type Ascent,
  GRADE_TO_POINTS,
  type Grade,
  STYLE_TO_POINTS,
} from '~/schema/ascent'

/**
 * Converts a climbing grade to its corresponding background color.
 *
 * If the provided grade is undefined or is not present in the
 * ASCENT_GRADE_TO_COLOR mapping, returns 'black'. Otherwise, returns the
 * background color associated with the grade.
 *
 * @param {Grade} [grade] - The climbing grade.
 * @returns {string} The background color for the given grade.
 */
export function fromGradeToBackgroundColor(grade?: Grade): string {
  if (!grade || !(grade in ASCENT_GRADE_TO_COLOR)) return 'black'
  return ASCENT_GRADE_TO_COLOR[grade as keyof typeof ASCENT_GRADE_TO_COLOR]
}

/**
 * Converts a climbing grade to its corresponding class name.
 *
 * If the provided grade is undefined, returns undefined.
 * Otherwise, returns a string where any '+' characters in the grade are
 * replaced by underscores. The class name is also prefixed with an underscore.
 *
 * @param {Ascent['topoGrade']} [grade] - The climbing grade.
 * @returns {string | undefined} The CSS class name for the given grade, or
 * undefined if no grade is provided.
 */
export function fromGradeToClassName(
  grade?: Ascent['topoGrade'],
): string | undefined {
  return grade === undefined ? undefined : `_${grade.replaceAll('+', '_')}`
}

/**
 * Converts a climbing ascent to its corresponding points value.
 *
 * Combines the points defined for the given climbing grade and style of the
 * ascent.
 *
 * @param {Ascent} params - The ascent
 * @param {Grade} params.topoGrade - The topo grade of the ascent
 * @param {string} params.style - The style of the ascent
 * @returns {number} The total points for the ascent
 */
export function fromAscentToPoints({ topoGrade, style }: Ascent): number {
  return (
    (GRADE_TO_POINTS[topoGrade as keyof typeof GRADE_TO_POINTS] ?? 0) +
    (STYLE_TO_POINTS[style] ?? 0)
  )
}
