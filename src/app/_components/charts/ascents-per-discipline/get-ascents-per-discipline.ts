import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import { type Ascent, CLIMBING_DISCIPLINE } from '~/schema/ascent'

type AscentsPerDiscipline = {
  id: Ascent['climbingDiscipline']
  label: Ascent['climbingDiscipline']
  value: number
  color: string
}[]

export function getAscentsPerDiscipline(
  ascents: Ascent[],
): AscentsPerDiscipline {
  if (ascents.length === 0) return []

  const initialValue: AscentsPerDiscipline = CLIMBING_DISCIPLINE.map(
    climbingDiscipline => ({
      color:
        CLIMBING_DISCIPLINE_TO_COLOR[climbingDiscipline] ?? 'var(--gray-5)',
      id: climbingDiscipline,
      label: climbingDiscipline,
      value: 0,
    }),
  )

  return ascents
    .reduce((acc, { climbingDiscipline }) => {
      const disciplineData = acc.find(({ id }) => id === climbingDiscipline)

      if (!disciplineData) return acc

      disciplineData.value += 1

      return acc
    }, initialValue)
    .filter(({ value }) => value > 0)
}
