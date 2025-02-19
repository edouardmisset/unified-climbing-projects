import {
  getDayOfYear,
  getDaysInYear,
  getWeekNumber,
  getWeeksInYear,
} from '~/helpers/date'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import type { StringDateTime } from '~/types/generic'

type YearlyDaysCollection<T> = {
  [year: number]: T[][]
}

export function createEmptyYearlyDaysCollection<T = Ascent | TrainingSession>(
  years: number[],
): YearlyDaysCollection<T> {
  const yearlyCollections: YearlyDaysCollection<T> = {}

  for (const year of years) {
    yearlyCollections[year] = Array.from({ length: getDaysInYear(year) }).map(
      () => [] as T[],
    )
  }

  return yearlyCollections
}

export function createYearList<T extends StringDateTime>(
  data: T[],
  options?: { descending?: boolean },
) {
  const { descending = true } = options ?? {}
  return [
    ...new Set(data.map(({ date }) => new Date(date).getFullYear())),
  ].sort((a, b) => (a - b) * (descending ? -1 : 1))
}

/** Initially, the array of training sessions is empty */
export const createYearlyDataDaysCollection = <
  T extends StringDateTime = TrainingSession | Ascent,
>(
  data: T[],
): YearlyDaysCollection<T> =>
  createEmptyYearlyDaysCollection<T>(createYearList(data))

export function groupDataDaysByYear<
  T extends StringDateTime = Ascent | TrainingSession,
>(ascents: T[]): YearlyDaysCollection<T> {
  return ascents.reduce((accumulator, ascent) => {
    const date = new Date(ascent.date)
    const year = date.getFullYear()
    const dayOfYear = getDayOfYear(date) - 1

    if (accumulator[year] === undefined) return accumulator

    const currentDayData = accumulator[year][dayOfYear]

    accumulator[year][dayOfYear] = [
      ...(currentDayData !== undefined ? currentDayData : []),
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

export function getYearsDataPerWeek<
  T extends StringDateTime = Ascent | TrainingSession,
>(data: T[]) {
  return data.reduce(
    (accumulator, item) => {
      const date = new Date(item.date)
      const year = date.getFullYear()
      const weekOfYear = getWeekNumber(date)

      if (accumulator[year] === undefined) return accumulator

      const itemsInWeek = accumulator[year][weekOfYear]

      accumulator[year][weekOfYear] = itemsInWeek
        ? [...itemsInWeek, item]
        : [item]

      return accumulator
    },
    { ...createEmptyBarcodeCollection(data) },
  )
}
