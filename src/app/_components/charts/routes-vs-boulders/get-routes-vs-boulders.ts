import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import { type Ascent, CLIMBING_DISCIPLINE } from '~/schema/ascent'

type RouteVsBoulder = {
  id: Ascent['climbingDiscipline']
  label: Ascent['climbingDiscipline']
  value: number
  color: string
}[]

export function getRoutesVsBoulders(ascents: Ascent[]): RouteVsBoulder {
  if (ascents.length === 0) return []

  const initialValue: RouteVsBoulder = CLIMBING_DISCIPLINE.map(
    climbingDiscipline => ({
      id: climbingDiscipline,
      label: climbingDiscipline,
      value: 0,
      color:
        CLIMBING_DISCIPLINE_TO_COLOR[climbingDiscipline] ?? 'var(--gray-5)',
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
