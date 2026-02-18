import { isDateInYear } from '@edouardmisset/date/is-date-in-year.ts'
import { createYearList } from '~/data/helpers'
import type { Ascent } from '~/schema/ascent'

type AscentsPerDisciplinePerYear = {
  Boulder: number
  BoulderColor: string
  Route: number
  RouteColor: string
  year: number
}

export const getAscentsPerDisciplinePerYear = (
  ascents: Ascent[],
): AscentsPerDisciplinePerYear[] => {
  if (ascents.length === 0) return []

  const years = createYearList(ascents, { descending: false, continuous: true })

  return years.map(year => {
    let boulderCount = 0
    let routeCount = 0

    for (const { date, climbingDiscipline } of ascents) {
      if (!isDateInYear(date, year)) continue
      if (climbingDiscipline === 'Boulder') boulderCount++
      if (climbingDiscipline === 'Route') routeCount++
    }

    return {
      Boulder: boulderCount,
      BoulderColor: 'var(--boulder)',
      Route: routeCount,
      RouteColor: 'var(--route)',
      year,
    }
  })
}
