import { getWeek } from '~/app/_components/year-grid/helpers.ts'
import type { Ascent } from '~/schema/ascent'
import { createEmptyBarcodeCollection } from './helpers.ts'

export function getYearsAscentsPerWeek(ascents: Ascent[]) {
  return ascents.reduce(
    (accumulator, ascent) => {
      const date = new Date(ascent.date)
      const year = date.getFullYear()
      const weekOfYear = getWeek(date)

      if (accumulator[year] === undefined) return accumulator

      const weekAscents = accumulator[year][weekOfYear]

      accumulator[year][weekOfYear] = weekAscents
        ? [...weekAscents, ascent]
        : [ascent]

      return accumulator
    },
    { ...createEmptyBarcodeCollection(ascents) },
  )
}
