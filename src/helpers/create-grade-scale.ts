import { _GRADES, type Grade } from '~/schema/ascent'

/**
 * Create a grade scale between two grades.
 * @param lowerGrade - The lower grade.
 * @param higherGrade - The higher grade.
 * @returns An array of grades between the specified lower and higher grades.
 */
export function createGradeScale(
  lowerGrade: Grade,
  higherGrade: Grade,
): Grade[] {
  const lowerGradeIndex = _GRADES.findIndex(grade => grade === lowerGrade)
  const higherGradeIndex = _GRADES.findIndex(grade => grade === higherGrade)

  if (
    lowerGradeIndex === -1 ||
    higherGradeIndex === -1 ||
    lowerGradeIndex > higherGradeIndex
  ) {
    return []
  }

  return _GRADES.slice(lowerGradeIndex, higherGradeIndex + 1)
}
