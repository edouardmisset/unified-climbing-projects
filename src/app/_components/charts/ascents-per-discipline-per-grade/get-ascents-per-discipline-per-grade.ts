import { createGradeScaleFromAscents } from '~/helpers/create-grade-scale'
import type { Ascent, Grade } from '~/schema/ascent'

type AscentsPerDisciplinePerGrade = {
  grade: Grade
  Boulder: number
  BoulderColor: string
  Route: number
  RouteColor: string
}[]

export const getAscentsPerDisciplinePerGrade = (
  ascents: Ascent[],
): AscentsPerDisciplinePerGrade => {
  if (ascents.length === 0) return []

  const grades = createGradeScaleFromAscents(ascents)
  const validGrades = new Set(grades)

  const groupByGrade = new Map<
    Grade,
    Record<Ascent['climbingDiscipline'], number>
  >(grades.map(grade => [grade, { Boulder: 0, 'Multi-Pitch': 0, Route: 0 }]))

  for (const { topoGrade, climbingDiscipline } of ascents) {
    if (!validGrades.has(topoGrade)) continue

    const ascentCountsByGrade = groupByGrade.get(topoGrade)
    if (ascentCountsByGrade === undefined) continue

    ascentCountsByGrade[climbingDiscipline] += 1
  }

  return grades.map(grade => {
    const { Boulder = 0, Route = 0 } = groupByGrade.get(grade) ?? {}

    return {
      Boulder,
      BoulderColor: 'var(--boulder)',
      grade,
      Route,
      RouteColor: 'var(--route)',
    }
  })
}
