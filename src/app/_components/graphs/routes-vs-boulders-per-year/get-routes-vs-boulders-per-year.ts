import { getAscentsYears } from '~/helpers/get-ascents-years'
import { isDateInYear } from '~/helpers/is-date-in-year'
import type { Ascent } from '~/schema/ascent'

export const getRoutesVsBouldersPerYear = (ascents: Ascent[]) => {
  const years = getAscentsYears(ascents)

  return years.map(year => {
    const ascentsInYear = ascents.filter(({ date }) => isDateInYear(date, year))

    const routes = ascentsInYear.filter(
      ({ climbingDiscipline }) => climbingDiscipline === 'Route',
    ).length

    const boulders = ascentsInYear.filter(
      ({ climbingDiscipline }) => climbingDiscipline === 'Boulder',
    ).length

    return {
      year,
      boulders,
      bouldersColor: 'var(--boulder)',
      routes,
      routesColor: 'var(--route)',
    }
  })
}
