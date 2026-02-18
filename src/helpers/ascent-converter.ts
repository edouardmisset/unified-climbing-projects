import { ASCENT_GRADE_TO_COLOR, DEFAULT_GRADE } from '~/constants/ascents'
import {
  type Ascent,
  BOULDERING_BONUS_POINTS,
  GRADE_TO_POINTS,
  type Grade,
  STYLE_TO_POINTS,
} from '~/schema/ascent'

type ColorGrade = keyof typeof ASCENT_GRADE_TO_COLOR
const isColorGrade = (g: Grade): g is ColorGrade => g in ASCENT_GRADE_TO_COLOR

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
  const isValidColorGrade = grade && grade in ASCENT_GRADE_TO_COLOR && isColorGrade(grade)
  if (isValidColorGrade) return ASCENT_GRADE_TO_COLOR[grade]

  return 'black'
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
export function fromGradeToClassName(grade?: Ascent['topoGrade']): string | undefined {
  return grade === undefined ? undefined : `_${grade.replaceAll('+', '_')}`
}

/**
 * Converts a climbing ascent to its corresponding points value.
 *
 * Combines the points defined for the given climbing grade, style, and discipline.
 *
 * @param {Ascent} params - The ascent object containing climb details.
 * @param {Grade} params.topoGrade - The topo grade of the ascent.
 * @param {string} params.style - The style of the ascent.
 * @param {string} params.climbingDiscipline - The discipline of the climb.
 * @returns {number} The total points for the ascent.
 */
export function fromAscentToPoints({ topoGrade, style, climbingDiscipline }: Ascent): number {
  type PointsGrade = keyof typeof GRADE_TO_POINTS
  const hasPoints = (grade: Grade): grade is PointsGrade => grade in GRADE_TO_POINTS

  // GRADE_TO_POINTS is a partial mapping - not all grades have points assigned
  const gradePoints = hasPoints(topoGrade) ? GRADE_TO_POINTS[topoGrade] : 0
  const stylePoints = STYLE_TO_POINTS[style] ?? 0
  const climbingDisciplineBonus = climbingDiscipline === 'Boulder' ? BOULDERING_BONUS_POINTS : 0

  return gradePoints + stylePoints + climbingDisciplineBonus
}

/**
 * Converts a points value to its corresponding climbing grade.
 *
 * *NOTE*: The returned grade is meant to for a **redpoint route** ascent.
 *
 * Looks up the grade that corresponds to the given points value in the
 * GRADE_TO_POINTS mapping.
 * If the points value is not found in the mapping, returns a default grade of
 * DEFAULT_GRADE and logs an error message.
 *
 * @param {number} points - The points value to convert to a grade.
 * @param {Object} [to] - Optional parameters to adjust the conversion.
 * @param {string} [to.climbingDiscipline='Route'] - The climbing discipline ('Route' or 'Boulder').
 * @param {string} [to.style='Redpoint'] - The climbing style.
 * @returns {Grade} The climbing grade corresponding to the points value, or
 * DEFAULT_GRADE if no match is found.
 */
export function fromPointToGrade(
  points: number,
  to?: Pick<Partial<Ascent>, 'climbingDiscipline' | 'style'>,
): Grade {
  const { climbingDiscipline = 'Route', style = 'Redpoint' } = to ?? {}

  const listOfPoints = Object.values(GRADE_TO_POINTS)

  const adjustedPoints =
    points -
    (STYLE_TO_POINTS[style] ?? 0) -
    (climbingDiscipline === 'Boulder' ? BOULDERING_BONUS_POINTS : 0)

  if (!listOfPoints.includes(adjustedPoints)) {
    globalThis.console.log(
      `Invalid value (${adjustedPoints}). Points should be between ${Math.min(
        ...listOfPoints,
      )} and ${Math.max(...listOfPoints)} in steps of 50 points`,
    )
    return DEFAULT_GRADE
  }

  // Find the grade that matches the adjusted points
  type PointsGrade = keyof typeof GRADE_TO_POINTS
  const isPointsGrade = (grade: string): grade is PointsGrade => grade in GRADE_TO_POINTS
  const matchingEntry = Object.entries(GRADE_TO_POINTS).find(
    ([, entryPoints]) => entryPoints === adjustedPoints,
  )
  const matchingGrade = matchingEntry?.[0]

  if (!matchingGrade || !isPointsGrade(matchingGrade)) {
    globalThis.console.log(
      `Error: No matching grade found for the given points (${adjustedPoints}).`,
    )
    return DEFAULT_GRADE
  }

  return matchingGrade
}
