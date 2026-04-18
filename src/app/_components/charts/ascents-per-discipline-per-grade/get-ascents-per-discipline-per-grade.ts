import { createGradeScaleFromAscents } from '~/helpers/create-grade-scale'
import { type Ascent, CLIMBING_DISCIPLINE, type Grade } from '~/schema/ascent'

type AscentsPerDisciplinePerGrade = {
  grade: Grade
  Boulder: number
  Route: number
}[]

export const getAscentsPerDisciplinePerGrade = (
  ascents: Ascent[],
): AscentsPerDisciplinePerGrade => {
  if (ascents.length === 0) return []

  const grades = createGradeScaleFromAscents(ascents)
  const validGrades = new Set(grades)

  const groupByGrade = new Map<Grade, Record<(typeof CLIMBING_DISCIPLINE)[number], number>>(
    grades.map(grade => [grade, { Boulder: 0, 'Multi-Pitch': 0, Route: 0 }]),
  )

  for (const { topoGrade, climbingDiscipline } of ascents) {
    if (!validGrades.has(topoGrade)) continue

    const ascentCountsByGrade = groupByGrade.get(topoGrade)
    if (ascentCountsByGrade === undefined) continue

    ascentCountsByGrade[climbingDiscipline as (typeof CLIMBING_DISCIPLINE)[number]] += 1
  }

  return grades.map(grade => {
    const { Boulder = 0, Route = 0 } = groupByGrade.get(grade) ?? {}

    return {
      Boulder,
      grade,
      Route,
    }
  })
}
