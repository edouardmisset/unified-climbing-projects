import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import { filterAscents } from '~/helpers/filter-ascents'
import { type Ascent, CLIMBING_DISCIPLINE } from '~/schema/ascent'

export function getRoutesVsBoulders(ascents: Ascent[]) {
  return CLIMBING_DISCIPLINE.map(climbingDiscipline => {
    const filteredAscentsCount = filterAscents(ascents, {
      climbingDiscipline,
    }).length

    return filteredAscentsCount > 0
      ? {
          id: climbingDiscipline,
          label: climbingDiscipline,
          value: filteredAscentsCount,
          color:
            CLIMBING_DISCIPLINE_TO_COLOR[climbingDiscipline] ?? 'var(--gray-5)',
        }
      : undefined
  }).filter(val => val !== undefined)
}
