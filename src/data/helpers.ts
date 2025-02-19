import {
  getDayOfYear,
  getDaysInYear,
  getWeekNumber,
  getWeeksInYear,
} from '~/helpers/date'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import type { StringDateTime } from '~/types/generic'

export function createYearList<
  T extends StringDateTime = TrainingSession | Ascent,
>(data: T[], options?: { descending?: boolean }) {
  const { descending = true } = options ?? {}
  return [
    ...new Set(data.map(({ date }) => new Date(date).getFullYear())),
  ].sort((a, b) => (a - b) * (descending ? -1 : 1))
}

type YearlyDaysCollection<T> = {
  [year: number]: T[][]
}

/** Initially, the array of data is empty */
export function initializeYearlyDataDaysCollection<
  T extends StringDateTime = TrainingSession | Ascent,
>(
  data: T[],
  getFractionInYear: (year: number) => number,
): YearlyDaysCollection<T> {
  const years = createYearList(data)
  const yearlyDataCollections: YearlyDaysCollection<T> = {}

  for (const year of years) {
    yearlyDataCollections[year] = Array.from({
      length: getFractionInYear(year),
    }).map(() => [] as T[])
  }
  return yearlyDataCollections
}

export function groupDataDaysByYear<
  T extends StringDateTime = Ascent | TrainingSession,
>(data: T[]): YearlyDaysCollection<T> {
  return data.reduce(
    (accumulator, item) => {
      const date = new Date(item.date)
      const year = date.getFullYear()
      const dayOfYear = getDayOfYear(date) - 1

      if (accumulator[year] === undefined) return accumulator

      const currentDayItem = accumulator[year][dayOfYear]

      accumulator[year][dayOfYear] = [
        ...(currentDayItem !== undefined ? currentDayItem : []),
        item,
      ]

      return accumulator
    },
    initializeYearlyDataDaysCollection(data, getDaysInYear),
  )
}

export function groupDataWeeksByYear<
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
    initializeYearlyDataDaysCollection(data, getWeeksInYear),
  )
}
