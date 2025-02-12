import { getWeek } from '~/app/_components/year-grid/helpers.ts'
import { getDayOfYear, getWeeksInYear } from '~/helpers/date.ts'
import type { Ascent } from '~/schema/ascent'
import type { StringDate } from '~/types/generic'
import { createEmptyYearlyCollections } from './helpers.ts'

export function createYearList<T extends StringDate>(
  data: T[],
  options?: { descending?: boolean },
) {
  const { descending = true } = options ?? {}
  return [
    ...new Set(data.map(({ date }) => new Date(date).getFullYear())),
  ].sort((a, b) => a - b * (descending ? -1 : 1))
}

function getAscentsCollection(ascents: Ascent[]): Record<number, StringDate[]> {
  return createEmptyYearlyCollections(createYearList(ascents))
}

export function getYearAscentPerDay(
  ascents: Ascent[],
): Record<number, (StringDate & { ascents: Ascent[] })[]> {
  return ascents.reduce(
    (acc, ascent) => {
      const date = new Date(ascent.date)
      const year = date.getFullYear()
      const dayOfYear = getDayOfYear(date)
      const currentYear = acc[year]

      if (currentYear === undefined) return acc

      const currentDay = currentYear[dayOfYear - 1]

      currentYear[dayOfYear - 1] = {
        date: date.toString(),
        ascents: [
          ...(currentDay?.ascents ? [...currentDay.ascents] : []),
          ascent,
        ],
      }
      return acc
    },
    getAscentsCollection(ascents) as Record<
      number,
      (StringDate & { ascents: Ascent[] })[]
    >,
  )
}

export function createEmptyBarcodeCollection<T extends Record<string, unknown>>(
  data: (T & StringDate)[],
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
      const thisYear = accumulator[year]

      if (thisYear === undefined) return accumulator

      const weekAscents = thisYear[weekOfYear]

      thisYear[weekOfYear] = weekAscents ? [...weekAscents, ascent] : [ascent]

      return accumulator
    },
    { ...createEmptyBarcodeCollection(ascents) },
  )
}
