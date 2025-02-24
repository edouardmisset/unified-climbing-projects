import { createYearList } from '~/data/helpers'
import { isDateInYear } from '~/helpers/is-date-in-year'
import type { Ascent } from '~/schema/ascent'

export const getRoutesVsBouldersPerYear = (ascents: Ascent[]) => {
  const years = createYearList(ascents, { descending: false })

  return years.map(year => {
    const { Boulder, Route } = ascents.reduce(
      (acc, { date, climbingDiscipline }) => {
        if (!isDateInYear(date, year)) return acc

        acc[climbingDiscipline] = (acc[climbingDiscipline] ?? 0) + 1
        return acc
      },
      {} as Record<Ascent['climbingDiscipline'], number>,
    )

    return {
      year,
      boulders: Boulder,
      bouldersColor: 'var(--boulder)',
      routes: Route,
      routesColor: 'var(--route)',
    }
  })
}
