import { GRADES, type Ascent, type Grade } from '~/schema/ascent'
import { minMaxGrades } from './min-max-grades'

/**
 * Create a grade scale between two grades.
 * @param lowerGrade - The lower grade.
 * @param higherGrade - The higher grade.
 * @returns An array of grades between the specified lower and higher grades.
 */
export function createGradeScaleFromAscents(ascents: Ascent[]): Grade[] {
  if (ascents.length === 0) return [...GRADES]

  const [lowerGrade, higherGrade] = minMaxGrades(ascents)

  const lowerGradeIndex = GRADES.indexOf(lowerGrade)
  const higherGradeIndex = GRADES.indexOf(higherGrade)

  if (lowerGradeIndex === -1 || higherGradeIndex === -1 || lowerGradeIndex > higherGradeIndex)
    return []

  return GRADES.slice(lowerGradeIndex, higherGradeIndex + 1)
}
