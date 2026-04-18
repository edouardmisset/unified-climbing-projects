import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import { type Ascent, CLIMBING_DISCIPLINE, climbingDisciplineSchema } from '~/schema/ascent'

const PARSED_DISCIPLINES = CLIMBING_DISCIPLINE.map(raw => ({
  color: CLIMBING_DISCIPLINE_TO_COLOR[raw] ?? 'var(--gray-5)',
  branded: climbingDisciplineSchema.parse(raw),
}))

type AscentsPerDiscipline = {
  id: Ascent['climbingDiscipline']
  label: Ascent['climbingDiscipline']
  value: number
  color: string
}[]

export function getAscentsPerDiscipline(ascents: Ascent[]): AscentsPerDiscipline {
  if (ascents.length === 0) return []

  const initialValue: AscentsPerDiscipline = PARSED_DISCIPLINES.map(({ branded, color }) => ({
    color,
    id: branded,
    label: branded,
    value: 0,
  }))

  return ascents
    .reduce((acc, { climbingDiscipline }) => {
      const disciplineData = acc.find(({ id }) => id === climbingDiscipline)

      if (!disciplineData) return acc

      disciplineData.value += 1

      return acc
    }, initialValue)
    .filter(({ value }) => value > 0)
}
