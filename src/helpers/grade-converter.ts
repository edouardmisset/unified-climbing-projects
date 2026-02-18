import { invert } from '@edouardmisset/object/invert.ts'
import { DEFAULT_GRADE } from '~/constants/ascents'
import { GRADE_TO_NUMBER, type Grade } from '~/schema/ascent'

export const NUMBER_TO_GRADE = invert(GRADE_TO_NUMBER)

/**
 * Converts a climbing grade to its corresponding numeric value.
 *
 * If the provided grade is not present in the GRADE_TO_NUMBER mapping,
 * logs an error and returns a default value of 1.
 *
 * @param {Grade} grade - The climbing grade to convert.
 * @returns {number} The numeric value associated with the given grade.
 */
export function fromGradeToNumber(grade: Grade): number {
  if (!(grade in GRADE_TO_NUMBER)) {
    globalThis.console.error(`Error in fromGradeToNumber, with grade: ${grade}`)
    return 1
  }

  return GRADE_TO_NUMBER[grade]
}

type GradeNumber = keyof typeof NUMBER_TO_GRADE
const isValidGradeNumber = (num: number): num is GradeNumber => num in NUMBER_TO_GRADE

/**
 * Converts a numeric grade to its corresponding Grade.
 *
 * If the provided number is not present in the NUMBER_TO_GRADE mapping, logs an
 * error and returns a default grade of DEFAULT_GRADE.
 *
 * @param {number} gradeNumber - The numeric grade to convert.
 * @returns {Grade} The converted grade.
 */
export const fromNumberToGrade = (gradeNumber: number): Grade => {
  if (!(gradeNumber in NUMBER_TO_GRADE)) {
    globalThis.console.error(`Error in fromNumberToGrade, with gradeNumber: ${gradeNumber}`)
    return DEFAULT_GRADE
  }

  return isValidGradeNumber(gradeNumber) ? NUMBER_TO_GRADE[gradeNumber] : DEFAULT_GRADE
}
