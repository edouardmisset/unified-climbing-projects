import { isDateInYear } from '@edouardmisset/date/is-date-in-year.ts'
import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import { createYearList } from '~/data/helpers'
import {
  type Ascent,
  BOULDERING,
  DEEP_WATER_SOLOING,
  MULTI_PITCH,
  SPORT,
} from '~/schema/ascent'

type AscentsPerDisciplinePerYear = {
  Bouldering: number
  BoulderingColor: string

  Sport: number
  SportColor: string

  MultiPitch?: number
  MultiPitchColor?: string

  DeepWaterSoloing?: number
  DeepWaterSoloingColor?: string

  Year: number
}

export const getAscentsPerDisciplinePerYear = (
  ascents: Ascent[],
): AscentsPerDisciplinePerYear[] => {
  if (ascents.length === 0) return []

  const years = createYearList(ascents, { descending: false, continuous: true })

  return years.map(year => {
    const {
      [BOULDERING]: Bouldering = 0,
      [SPORT]: Sport = 0,
      [MULTI_PITCH]: MultiPitch = 0,
      [DEEP_WATER_SOLOING]: DeepWaterSoloing = 0,
    } = ascents.reduce(
      (acc, { date, discipline }) => {
        if (!isDateInYear(date, year)) return acc

        acc[discipline] = (acc[discipline] ?? 0) + 1
        return acc
      },
      {} as Record<Ascent['discipline'], number>,
    )

    return {
      Bouldering,
      BoulderingColor: CLIMBING_DISCIPLINE_TO_COLOR[BOULDERING],
      Sport,
      SportColor: CLIMBING_DISCIPLINE_TO_COLOR[SPORT],
      MultiPitch,
      MultiPitchColor: CLIMBING_DISCIPLINE_TO_COLOR[MULTI_PITCH],
      DeepWaterSoloing,
      DeepWaterSoloingColor: CLIMBING_DISCIPLINE_TO_COLOR[DEEP_WATER_SOLOING],
      Year: year,
    }
  })
}
