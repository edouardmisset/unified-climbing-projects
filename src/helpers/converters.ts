import { invert } from '@edouardmisset/object/invert.ts'
import { GRADE_TO_NUMBER, type Grade } from '~/schema/ascent'

export const NUMBER_TO_GRADE = invert(GRADE_TO_NUMBER)

export function fromGradeToNumber(grade: Grade): number {
  try {
    return GRADE_TO_NUMBER[grade]
  } catch (error) {
    globalThis.console.error(`Error in fromGradeToNumber: ${error}
with grade: ${grade}`)
    return 1
  }
}

export const fromNumberToGrade = (gradeNumber: number): Grade => {
  if (gradeNumber in NUMBER_TO_GRADE) {
    return NUMBER_TO_GRADE[gradeNumber as keyof typeof NUMBER_TO_GRADE]
  }
  globalThis.console.error(
    `Error in fromNumberToGrade, with gradeNumber: ${gradeNumber}`,
  )
  return '1a'
}
