import { _GRADES, type Ascent, type Grade } from '~/schema/ascent'
import { minMaxGrades } from './min-max-grades'

/**
 * Create a grade scale between two grades.
 * @param lowerGrade - The lower grade.
 * @param higherGrade - The higher grade.
 * @returns An array of grades between the specified lower and higher grades.
 */
export function createGradeScaleFromAscents(ascents: Ascent[]): Grade[] {
  if (ascents.length === 0) return [..._GRADES]

  const [lowerGrade, higherGrade] = minMaxGrades(ascents)

  const lowerGradeIndex = _GRADES.indexOf(lowerGrade)
  const higherGradeIndex = _GRADES.indexOf(higherGrade)

  if (
    lowerGradeIndex === -1 ||
    higherGradeIndex === -1 ||
    lowerGradeIndex > higherGradeIndex
  ) {
    return []
  }

  return _GRADES.slice(lowerGradeIndex, higherGradeIndex + 1)
}
