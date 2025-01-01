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
            climbingDiscipline === 'Route' ? 'var(--blue-6)' : 'var(--red-6)',
        }
      : undefined
  }).filter(Boolean)
}
