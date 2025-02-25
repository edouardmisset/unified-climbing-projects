import { createGradeScale } from '~/helpers/create-grade-scale'
import { minMaxGrades } from '~/helpers/min-max-grades'
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
  // TODO: maybe refactor these two functions into one ? and pass Ascent[] as
  // argument ?
  const grades = createGradeScale(...minMaxGrades(ascents))

  const gradeClimbingStylesCount: GradeFrequency = grades.map(grade => {
    const initialStyleFrequency: Record<Ascent['style'], number> = {
      Onsight: 0,
      Flash: 0,
      Redpoint: 0,
    }

    const { Flash, Onsight, Redpoint } = ascents.reduce(
      (acc, { topoGrade, style }) => {
        if (topoGrade !== grade) {
          return acc
        }

        acc[style] += 1
        return acc
      },
      initialStyleFrequency,
    )

    return {
      grade,
      Onsight,
      OnsightColor: 'var(--onsight)',
      Flash,
      FlashColor: 'var(--flash)',
      Redpoint,
      RedpointColor: 'var(--redpoint)',
    }
  })

  return gradeClimbingStylesCount
}
