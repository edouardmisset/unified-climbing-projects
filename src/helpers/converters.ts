import { invert } from '@edouardmisset/object/invert.ts'
import { GRADE_TO_NUMBER, type Grade } from '~/schema/ascent'

export const NUMBER_TO_GRADE = invert(GRADE_TO_NUMBER)

export const fromGradeToNumber = (grade: Grade): number =>
  GRADE_TO_NUMBER[grade] ?? 1

export const fromNumberToGrade = (gradeNumber: number): Grade =>
  NUMBER_TO_GRADE[gradeNumber as keyof typeof NUMBER_TO_GRADE] ?? '1a'
