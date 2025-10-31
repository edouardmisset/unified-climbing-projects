import { isDateInYear } from '@edouardmisset/date/is-date-in-year.ts'
import { createYearList } from '~/data/helpers'
import type { Ascent } from '~/schema/ascent'

type AscentsPerDisciplinePerYear = {
  bouldering: number
  boulderingColor: string
  sport: number
  sportColor: string

  year: number
}

export const getAscentsPerDisciplinePerYear = (
  ascents: Ascent[],
): AscentsPerDisciplinePerYear[] => {
  if (ascents.length === 0) return []

  const years = createYearList(ascents, { descending: false, continuous: true })

  return years.map(year => {
    const { Bouldering = 0, Sport = 0 } = ascents.reduce(
      (acc, { date, discipline }) => {
        if (!isDateInYear(date, year)) return acc

        acc[discipline] = (acc[discipline] ?? 0) + 1
        return acc
      },
      {} as Record<Ascent['discipline'], number>,
    )

    return {
      bouldering: Bouldering,
      boulderingColor: 'var(--bouldering)',
      sport: Sport,
      sportColor: 'var(--sport)',
      year,
    }
  })
}
