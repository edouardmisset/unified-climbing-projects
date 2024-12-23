import { isDateInYear } from '~/helpers/is-date-in-year'
import type { Ascent } from '~/schema/ascent'

export const getRoutesVsBouldersPerYear = (ascents: Ascent[]) => {
  const years = [
    ...new Set(ascents.map(({ date }) => new Date(date).getFullYear())),
  ].sort()

  return years.map(year => {
    const filteredAscentsByYear = ascents.filter(({ date }) =>
      isDateInYear(date, year),
    )

    const routes = filteredAscentsByYear.filter(
      ({ climbingDiscipline }) => climbingDiscipline === 'Route',
    ).length
    const boulders = filteredAscentsByYear.filter(
      ({ climbingDiscipline }) => climbingDiscipline === 'Boulder',
    ).length

    return {
      year,
      boulders,
      bouldersColor: 'var(--red-5)',
      routes,
      routesColor: 'var(--blue-5)',
    }
  })
}
