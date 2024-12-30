import { getWeek } from '~/app/_components/year-grid/helpers.ts'
import { getDayOfYear, getWeeksInYear } from '~/helpers/date.ts'
import type { Ascent } from '~/schema/ascent'
import type { StringDateTime } from '~/types/generic'
import { createEmptyYearlyCollections } from './helpers.ts'

export function createYearList<T extends Record<string, unknown>>(
  data: (T & { date: string })[],
) {
  return [
    ...new Set(data.map(({ date }) => new Date(date).getFullYear())),
  ].sort((a, b) => b - a)
}

const getAscentsCollection: (
  ascents: Ascent[],
) => Record<number, (StringDateTime & { ascents?: Ascent[] })[]> = (
  ascents: Ascent[],
) => createEmptyYearlyCollections(createYearList(ascents))

export function getYearAscentPerDay(ascents: Ascent[]) {
  return ascents.reduce(
    (acc, ascent) => {
      const date = new Date(ascent.date)
      const year = date.getFullYear()
      const dayOfYear = getDayOfYear(date)

      const thisDay = acc[year]?.[dayOfYear - 1]

      if (acc[year] === undefined) return acc

      acc[year][dayOfYear - 1] = {
        date: date.toString(),
        ascents: [...(thisDay?.ascents ? [...thisDay.ascents] : []), ascent],
      }
      return acc
    },
    { ...getAscentsCollection(ascents) },
  )
}

export function createEmptyBarcodeCollection<T extends Record<string, unknown>>(
  data: (T & { date: string })[],
) {
  return Object.fromEntries(
    createYearList(data).map(year => [
      year,
      Array.from({ length: getWeeksInYear(year) }, (): T[] => []),
    ]),
  )
}

export function getYearsAscentsPerWeek(ascents: Ascent[]) {
  return ascents.reduce(
    (accumulator, ascent) => {
      const date = new Date(ascent.date)
      const year = date.getFullYear()
      const weekOfYear = getWeek(date)

      const weekAscents = accumulator[year]?.[weekOfYear]

      if (accumulator[year] === undefined) return accumulator

      accumulator[year][weekOfYear] = weekAscents
        ? [...weekAscents, ascent]
        : [ascent]

      return accumulator
    },
    { ...createEmptyBarcodeCollection(ascents) },
  )
}
