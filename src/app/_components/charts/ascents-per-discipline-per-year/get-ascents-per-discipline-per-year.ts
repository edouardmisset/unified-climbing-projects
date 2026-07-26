import { isDateInYear } from '@edouardmisset/date/is-date-in-year.ts'
import { createYearList } from '~/data/helpers'
import type { Ascent } from '~/schema/ascent'

type AscentsPerDisciplinePerYear = {
  Boulder: number
  Route: number
  year: number
}

export const getAscentsPerDisciplinePerYear = (
  ascents: Ascent[],
): AscentsPerDisciplinePerYear[] => {
  if (ascents.length === 0) return []

  const years = createYearList(ascents, { descending: false, continuous: true })

  return years.map((year) => {
    let boulderCount = 0
    let routeCount = 0

    for (const { date, discipline } of ascents) {
      if (!isDateInYear(date, year)) continue
      if (discipline === 'Bouldering') boulderCount++
      if (discipline === 'Sport') routeCount++
    }

    return {
      Boulder: boulderCount,
      Route: routeCount,
      year,
    }
  })
}
