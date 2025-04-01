import { createGradeScale } from '~/helpers/create-grade-scale'
import { minMaxGrades } from '~/helpers/min-max-grades'
import type { Ascent, Grade } from '~/schema/ascent'

type GetRoutesVsBouldersPerYearOutput = {
  grade: Grade
  Boulder: number
  BoulderColor: string
  Route: number
  RouteColor: string
}[]

export const getRoutesVsBouldersPerGrade = (
  ascents: Ascent[],
): GetRoutesVsBouldersPerYearOutput => {
  if (ascents.length === 0) return []

  const grades = createGradeScale(...minMaxGrades(ascents))
  const validGrades = new Set(grades)

  const groupByYear = new Map<
    Grade,
    Record<Ascent['climbingDiscipline'], number>
  >(grades.map(grade => [grade, { Boulder: 0, Route: 0, 'Multi-Pitch': 0 }]))

  for (const { topoGrade, climbingDiscipline } of ascents) {
    if (!validGrades.has(topoGrade)) continue

    const ascentCountsByYear = groupByYear.get(topoGrade)
    if (ascentCountsByYear === undefined) continue

    ascentCountsByYear[climbingDiscipline] =
      (ascentCountsByYear[climbingDiscipline] ?? 0) + 1
  }

  return grades.map(grade => {
    const { Boulder = 0, Route = 0 } = groupByYear.get(grade) ?? {}

    return {
      grade,
      Boulder,
      BoulderColor: 'var(--boulder)',
      Route,
      RouteColor: 'var(--route)',
    }
  })
}
