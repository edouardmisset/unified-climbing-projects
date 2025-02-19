import {
  calculateDayOfYear,
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

/** Note that the array of data of type T can represent a **week or a day** of data. */
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
  return groupDataByYear(data, {
    // We want the index to be 0-based to index into an array
    getIndex: date => getDayOfYear(date) - 1,
    getFractionInYear: getDaysInYear,
  })
}

export function groupDataWeeksByYear<
  T extends StringDateTime = Ascent | TrainingSession,
>(data: T[]): YearlyDaysCollection<T> {
  return groupDataByYear(data, {
    getIndex: getWeekNumber,
    getFractionInYear: getWeeksInYear,
  })
}

type GroupDataByYearOptions = {
  getIndex: (date: Date) => number
  getFractionInYear: (year: number) => number
}

function groupDataByYear<T extends StringDateTime = Ascent | TrainingSession>(
  data: T[],
  options: GroupDataByYearOptions,
): YearlyDaysCollection<T> {
  const { getIndex, getFractionInYear } = options

  const groups = initializeYearlyDataDaysCollection(data, getFractionInYear)

  return data.reduce((accumulator, item) => {
    const date = new Date(item.date)
    const year = date.getFullYear()
    const index = getIndex(date)

    if (accumulator[year] === undefined) return accumulator

    const itemsInGroup = accumulator[year][index]
    accumulator[year][index] =
      itemsInGroup === undefined ? [item] : [...itemsInGroup, item]

    return accumulator
  }, groups)
}
