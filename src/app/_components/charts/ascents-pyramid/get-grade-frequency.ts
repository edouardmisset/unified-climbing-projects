import { createGradeScaleFromAscents } from '~/helpers/create-grade-scale'
import type { Ascent, Grade } from '~/schema/ascent'

export type GradeFrequency = {
  grade: Grade
  Onsight: number
  OnsightColor: string
  Flash: number
  FlashColor: string
  Redpoint: number
  RedpointColor: string
}[]

export function getGradeFrequencyAndColors(ascents: Ascent[]): GradeFrequency {
  if (ascents.length === 0) {
    return []
  }

  const grades = createGradeScaleFromAscents(ascents)

  const gradeClimbingStylesCount: GradeFrequency = grades.map(grade => {
    const initialStyleFrequency: Record<Ascent['style'], number> = {
      Flash: 0,
      Onsight: 0,
      Redpoint: 0,
    }

    const { Flash, Onsight, Redpoint } = ascents.reduce((acc, { topoGrade, style }) => {
      if (topoGrade !== grade) {
        return acc
      }

      acc[style] += 1
      return acc
    }, initialStyleFrequency)

    return {
      Flash,
      FlashColor: 'var(--flash)',
      grade,
      Onsight,
      OnsightColor: 'var(--onsight)',
      Redpoint,
      RedpointColor: 'var(--redpoint)',
    }
  })

  return gradeClimbingStylesCount
}
