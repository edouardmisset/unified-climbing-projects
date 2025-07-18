import { _GRADES, type Ascent, type Grade } from '~/schema/ascent'
import { fromGradeToNumber, fromNumberToGrade } from './grade-converter'

/**
 * Calculates the minimum and maximum grades from a list of ascents.
 *
 * @param ascents - The list of ascents to evaluate.
 * @returns A tuple containing the lowest and highest grades (in that order). If
 * the list is empty, the lowest grade is 1 and the highest grade is the last
 * grade in the list of grades.
 */
export function minMaxGrades(ascents: Ascent[]): [Grade, Grade] {
  if (ascents.length === 0) {
    return [fromNumberToGrade(1), fromNumberToGrade(_GRADES.length)]
  }

  const numberGrades = ascents.map(({ topoGrade }) =>
    fromGradeToNumber(topoGrade),
  )

  const lowestGrade = fromNumberToGrade(Math.min(...numberGrades))
  const highestGrade = fromNumberToGrade(Math.max(...numberGrades))
  return [lowestGrade, highestGrade]
}
