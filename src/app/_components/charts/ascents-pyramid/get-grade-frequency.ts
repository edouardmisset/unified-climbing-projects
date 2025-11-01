import { ASCENT_STYLE_TO_COLOR } from '~/constants/ascents'
import { createGradeScaleFromAscents } from '~/helpers/create-grade-scale'
import {
  type Ascent,
  FLASH,
  type Grade,
  ONSIGHT,
  REDPOINT,
} from '~/schema/ascent'

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

  const gradeClimbingStylesCount: GradeFrequency = grades.map(currentGrade => {
    const initialStyleFrequency: Record<Ascent['style'], number> = {
      [FLASH]: 0,
      [ONSIGHT]: 0,
      [REDPOINT]: 0,
    }

    const {
      [FLASH]: flash,
      [ONSIGHT]: onsight,
      [REDPOINT]: redpoint,
    } = ascents.reduce((acc, { grade, style }) => {
      if (grade !== currentGrade) return acc

      acc[style] += 1
      return acc
    }, initialStyleFrequency)

    return {
      Flash: flash,
      FlashColor: ASCENT_STYLE_TO_COLOR[FLASH],
      grade: currentGrade,
      Onsight: onsight,
      OnsightColor: ASCENT_STYLE_TO_COLOR[ONSIGHT],
      Redpoint: redpoint,
      RedpointColor: ASCENT_STYLE_TO_COLOR[REDPOINT],
    }
  })

  return gradeClimbingStylesCount
}
