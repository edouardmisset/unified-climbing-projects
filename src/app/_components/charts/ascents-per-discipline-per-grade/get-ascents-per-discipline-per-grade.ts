import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import { createGradeScaleFromAscents } from '~/helpers/create-grade-scale'
import {
  type Ascent,
  BOULDERING,
  DEEP_WATER_SOLOING,
  type Grade,
  MULTI_PITCH,
  SPORT,
} from '~/schema/ascent'

type AscentsPerDisciplinePerGrade = {
  grade: Grade
  Bouldering: number
  BoulderingColor: string
  Sport: number
  SportColor: string
  MultiPitch?: number
  MultiPitchColor?: string
  DeepWaterSoloing?: number
  DeepWaterSoloingColor?: string
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
      {
        [BOULDERING]: 0,
        [DEEP_WATER_SOLOING]: 0,
        [MULTI_PITCH]: 0,
        [SPORT]: 0,
      },
    ]),
  )

  for (const { grade, discipline } of ascents) {
    if (!validGrades.has(grade)) continue

    const ascentCountsByGrade = groupByGrade.get(grade)
    if (ascentCountsByGrade === undefined) continue

    ascentCountsByGrade[discipline] += 1
  }

  return grades.map(grade => {
    const {
      [BOULDERING]: Bouldering = 0,
      [SPORT]: Sport = 0,
      [DEEP_WATER_SOLOING]: DeepWaterSoloing = 0,
      [MULTI_PITCH]: MultiPitch = 0,
    } = groupByGrade.get(grade) ?? {}

    return {
      Bouldering,
      BoulderingColor: CLIMBING_DISCIPLINE_TO_COLOR[BOULDERING],
      grade,
      Sport,
      SportColor: CLIMBING_DISCIPLINE_TO_COLOR[SPORT],
      MultiPitch,
      MultiPitchColor: CLIMBING_DISCIPLINE_TO_COLOR[MULTI_PITCH],
      DeepWaterSoloing,
      DeepWaterSoloingColor: CLIMBING_DISCIPLINE_TO_COLOR[DEEP_WATER_SOLOING],
    }
  })
}
