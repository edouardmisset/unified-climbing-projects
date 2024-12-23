import { type Ascent, CLIMBING_DISCIPLINE } from '~/schema/ascent'

export function getRoutesVsBoulders(ascents: Ascent[]) {
  return CLIMBING_DISCIPLINE.map(type => {
    const filteredAscentsCount = ascents.filter(
      ({ climbingDiscipline }) => climbingDiscipline === type,
    ).length
    return filteredAscentsCount > 0
      ? {
          id: type,
          label: type,
          value: filteredAscentsCount,
          color: type === 'Route' ? 'var(--blue-6)' : 'var(--red-6)',
        }
      : undefined
  }).filter(Boolean)
}
