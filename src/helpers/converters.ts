import { invert } from '@edouardmisset/object'
import { GRADE_TO_NUMBER, type Grade } from '~/schema/ascent'

export const NUMBER_TO_GRADE = invert(GRADE_TO_NUMBER)

export const convertGradeToNumber = (grade: Grade): number =>
  GRADE_TO_NUMBER[grade] ?? 1

export const convertNumberToGrade = (gradeNumber: number): Grade =>
  NUMBER_TO_GRADE[gradeNumber as keyof typeof NUMBER_TO_GRADE] ?? '1a'