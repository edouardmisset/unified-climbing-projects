import { isDateInYear } from '@edouardmisset/date/is-date-in-year.ts'
import { createYearList } from '~/shared/data/helpers'
import { calculateTopTenScore } from '~/ascents/helpers/calculate-top-ten'
import { countUniqueDates } from '~/shared/helpers/count-unique-dates'
import type { Ascent } from '~/ascents/schema'

type TopTenEvolutionDatum = {
  Boulder: number
  Route: number
  ascents: number
  outdoorDays: number
  topTenScore: number
  year: number
}

export function getTopTenEvolution(ascents: Ascent[]): TopTenEvolutionDatum[] {
  if (ascents.length === 0) return []

  const years = createYearList(ascents, { descending: false, continuous: true })

  return years.map(year => {
    const ascentsInYear = ascents.filter(({ date }) => isDateInYear(date, year))
    const { Boulder, Route } = ascentsInYear.reduce(
      (acc, { climbingDiscipline }) => {
        if (climbingDiscipline === 'Boulder') acc.Boulder++
        if (climbingDiscipline === 'Route') acc.Route++
        return acc
      },
      { Boulder: 0, Route: 0 },
    )

    return {
      Boulder,
      Route,
      ascents: ascentsInYear.length,
      outdoorDays: countUniqueDates(ascentsInYear),
      topTenScore: calculateTopTenScore(ascentsInYear),
      year,
    }
  })
}
