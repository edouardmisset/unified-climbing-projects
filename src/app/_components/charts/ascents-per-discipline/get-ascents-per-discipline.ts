import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import { type Ascent, CLIMBING_DISCIPLINE } from '~/schema/ascent'

type AscentsPerDiscipline = {
  id: Ascent['discipline']
  label: Ascent['discipline']
  value: number
  color: string
}[]

export function getAscentsPerDiscipline(
  ascents: Ascent[],
): AscentsPerDiscipline {
  if (ascents.length === 0) return []

  const initialValue: AscentsPerDiscipline = CLIMBING_DISCIPLINE.map(
    discipline => ({
      color: CLIMBING_DISCIPLINE_TO_COLOR[discipline],
      id: discipline,
      label: discipline,
      value: 0,
    }),
  )

  return ascents
    .reduce((acc, { discipline }) => {
      const disciplineData = acc.find(({ id }) => id === discipline)

      if (!disciplineData) return acc

      disciplineData.value += 1

      return acc
    }, initialValue)
    .filter(({ value }) => value > 0)
}
