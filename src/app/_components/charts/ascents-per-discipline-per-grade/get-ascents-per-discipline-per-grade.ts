import { createGradeScaleFromAscents } from '~/helpers/create-grade-scale'
import type { Ascent, Grade } from '~/schema/ascent'

type AscentsPerDisciplinePerGrade = {
  grade: Grade
  Bouldering: number
  BoulderingColor: string
  Sport: number
  SportColor: string
}[]

export const getAscentsPerDisciplinePerGrade = (
  ascents: Ascent[],
): AscentsPerDisciplinePerGrade => {
  if (ascents.length === 0) return []

  const grades = createGradeScaleFromAscents(ascents)
  const validGrades = new Set(grades)

  const groupByGrade = new Map<Grade, Record<Ascent['discipline'], number>>(
    grades.map(grade => [
      grade,
      { Bouldering: 0, 'Deep Water Soloing': 0, 'Multi-Pitch': 0, Sport: 0 },
    ]),
  )

  for (const { grade: topoGrade, discipline: climbingDiscipline } of ascents) {
    if (!validGrades.has(topoGrade)) continue

    const ascentCountsByGrade = groupByGrade.get(topoGrade)
    if (ascentCountsByGrade === undefined) continue

    ascentCountsByGrade[climbingDiscipline] += 1
  }

  return grades.map(grade => {
    const { Bouldering = 0, Sport = 0 } = groupByGrade.get(grade) ?? {}

    return {
      Bouldering,
      BoulderingColor: 'var(--bouldering)',
      grade,
      Sport,
      SportColor: 'var(--sport)',
    }
  })
}
