import { isDateInLast12Months, isDateInYear } from '@edouardmisset/date'
import type { Ascent } from '~/schema/ascent'
import type { Timeframe } from '~/schema/generic'
import { fromAscentToPoints } from './ascent-converter'

type GetTopTenParams = {
  ascents: Ascent[]
  timeframe: Timeframe
  year?: number
}

export function getTopTenAscents(params: GetTopTenParams): Ascent[] {
  const {
    timeframe = 'year',
    year = new Date().getFullYear(),
    ascents = [],
  } = params

  if (ascents.length === 0) return []

  const sortedAscentsWithPoints = ascents
    .filter(({ date }) => {
      if (timeframe === 'all-time') return true
      if (timeframe === 'year') return isDateInYear(date, year)
      if (timeframe === 'last-12-months') return isDateInLast12Months(date)
      return true
    })
    .map(ascent => ({ ...ascent, points: fromAscentToPoints(ascent) }))
  return sortedAscentsWithPoints.slice(0, 10)
}
