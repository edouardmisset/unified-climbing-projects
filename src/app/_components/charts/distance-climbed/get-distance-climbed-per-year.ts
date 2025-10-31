import { createYearList } from '~/data/helpers'
import type { Ascent } from '~/schema/ascent'

type DistanceClimbedPerYear = {
  distance: number
  year: number
  // averageHeight?: number
}

export const getDistanceClimbedPerYear = (
  ascents: Ascent[],
): DistanceClimbedPerYear[] => {
  const filteredAscents = ascents.filter(
    ascent =>
      ascent.discipline === 'Sport' &&
      ascent.height !== undefined &&
      ascent.height > 0,
  )

  if (filteredAscents.length === 0) return []

  const years = createYearList(filteredAscents, {
    descending: false,
    continuous: true,
  })

  const ascentsByYear = new Map<number, Ascent[]>(years.map(year => [year, []]))

  for (const ascent of filteredAscents) {
    const year = new Date(ascent.date).getFullYear()

    ascentsByYear.get(year)?.push(ascent)
  }

  return years.map(year => {
    const yearAscents = ascentsByYear.get(year) ?? []
    const totalDistance = yearAscents.reduce(
      (acc, ascent) => acc + (ascent.height ?? 0),
      0,
    )

    return {
      distance: totalDistance,
      year,
      // averageHeight: yearAscents.length
      //   ? Math.round(totalDistance / yearAscents.length)
      //   : 0,
    }
  })
}
