import { getWeek } from '~/app/_components/year-grid/helpers.ts'
import { getDayOfYear, getWeeksInYear } from '~/helpers/date.ts'
import type { Ascent } from '~/schema/ascent'
import { createYearList, createYearlyDataDaysCollection } from './helpers.ts'

type AscentsInDay = Ascent[]
export function getYearAscentPerDay(ascents: Ascent[]): {
  [year: number]: AscentsInDay[]
} {
  return ascents.reduce((accumulator, ascent) => {
    const date = new Date(ascent.date)
    const year = date.getFullYear()
    const dayOfYear = getDayOfYear(date) - 1

    if (accumulator[year] === undefined) return accumulator

    const currentDayAscents = accumulator[year][dayOfYear]

    accumulator[year][dayOfYear] = [
      ...(currentDayAscents !== undefined ? currentDayAscents : []),
      ascent,
    ]

    return accumulator
  }, createYearlyDataDaysCollection(ascents))
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
