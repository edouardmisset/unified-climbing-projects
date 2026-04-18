import { createGradeScaleFromAscents } from '~/helpers/create-grade-scale'
import { type Ascent, ASCENT_STYLE, type Grade } from '~/schema/ascent'

type GradeFrequency = {
  grade: Grade
  Onsight: number
  Flash: number
  Redpoint: number
}[]

export function getGradeFrequencyAndColors(ascents: Ascent[]): GradeFrequency {
  if (ascents.length === 0) return []

  const grades = createGradeScaleFromAscents(ascents)

  const gradeClimbingStylesCount: GradeFrequency = grades.map(grade => {
    const initialStyleFrequency: Record<(typeof ASCENT_STYLE)[number], number> = {
      Flash: 0,
      Onsight: 0,
      Redpoint: 0,
    }

    const { Flash, Onsight, Redpoint } = ascents.reduce((acc, { topoGrade, style }) => {
      if (topoGrade !== grade) return acc

      acc[style as keyof typeof initialStyleFrequency] += 1
      return acc
    }, initialStyleFrequency)

    return {
      Flash,
      grade,
      Onsight,
      Redpoint,
    }
  })

  return gradeClimbingStylesCount
}
