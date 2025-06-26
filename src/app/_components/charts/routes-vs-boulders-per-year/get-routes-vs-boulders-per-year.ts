import { isDateInYear } from '@edouardmisset/date/is-date-in-year.ts'
import { createYearList } from '~/data/helpers'
import type { Ascent } from '~/schema/ascent'

export const getRoutesVsBouldersPerYear = (ascents: Ascent[]) => {
  if (ascents.length === 0) return []

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
      Boulder,
      BoulderColor: 'var(--boulder)',
      Route,
      RouteColor: 'var(--route)',
      year,
    }
  })
}
