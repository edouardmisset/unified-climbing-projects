import { createGradeScaleFromAscents } from '~/helpers/create-grade-scale'
import type { Ascent, Grade } from '~/schema/ascent'

type AscentsPerDisciplinePerGrade = {
  grade: Grade
  Bouldering: number
  Sport: number
}[]

export const getAscentsPerDisciplinePerGrade = (
  ascents: Ascent[],
): AscentsPerDisciplinePerGrade => {
  if (ascents.length === 0) return []

  const grades = createGradeScaleFromAscents(ascents)
  const validGrades = new Set(grades)

  const groupByGrade = new Map<Grade, Record<Ascent['discipline'], number>>(
    grades.map(grade => [grade, { Bouldering: 0, 'Multi-Pitch': 0, Sport: 0 }]),
  )

  for (const { grade, discipline } of ascents) {
    if (!validGrades.has(grade)) continue

    const ascentCountsByGrade = groupByGrade.get(grade)
    if (ascentCountsByGrade === undefined) continue

    ascentCountsByGrade[discipline] += 1
  }

  return grades.map(grade => {
    const { Bouldering = 0, Sport = 0 } = groupByGrade.get(grade) ?? {}

    return {
      Bouldering,
      grade,
      Sport,
    }
  })
}
