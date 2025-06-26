import { range } from '@edouardmisset/array'
import {
  getDayOfYear,
  getDaysInYear,
  getWeekNumber,
  getWeeksInYear,
} from '~/helpers/date'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import type { StringDate } from '~/types/generic'

/**
 * Extracts unique years from data and returns them sorted.
 *
 * @template T - The type of data, must extend StringDate.
 * @param {T[]} data - Array of data objects containing a `date` property.
 * @param {Object} [options] - Optional configuration.
 * @param {boolean} [options.descending=true] - Whether to sort years in descending order.
 * @param {boolean} [options.continuous=false] - Whether to fill gaps between min and max years.
 * @returns {number[]} Array of years, sorted as specified.
 */
export function createYearList<T extends StringDate = TrainingSession | Ascent>(
  data: T[],
  options?: { descending?: boolean; continuous?: boolean },
): number[] {
  const { descending = true, continuous = false } = options ?? {}

  if (data.length === 0) return []

  const uniqueYears = [
    ...new Set(data.map(({ date }) => new Date(date).getFullYear())),
  ]

  const yearsToSort = continuous
    ? range(Math.min(...uniqueYears), Math.max(...uniqueYears))
    : uniqueYears

  return yearsToSort.sort((a, b) => (a - b) * (descending ? -1 : 1))
}

/** Note that the array of data of type T can represent a **week or a day** of data. */
type YearlyDaysCollection<T> = {
  [year: number]: T[][]
}

/** Initially, the array of data is empty */
function initializeYearlyDataDaysCollection<
  T extends StringDate = TrainingSession | Ascent,
>(
  data: T[],
  getFractionInYear: (year: number) => number,
): YearlyDaysCollection<T> {
  const years = createYearList(data, { continuous: true })
  const yearlyDataCollections: YearlyDaysCollection<T> = {}

  for (const year of years) {
    // number of weeks or days in a year
    const fractionsInYear = getFractionInYear(year)

    yearlyDataCollections[year] = Array.from({
      length: fractionsInYear,
    }).map(() => [] as T[])
  }
  return yearlyDataCollections
}

export function groupDataDaysByYear<
  T extends StringDate = Ascent | TrainingSession,
>(data: T[]): YearlyDaysCollection<T> {
  return groupDataByYear(data, {
    getFractionInYear: getDaysInYear,
    // We want the index to be 0-based to index into an array
    getIndex: date => getDayOfYear(date) - 1,
  })
}

export function groupDataWeeksByYear<
  T extends StringDate = Ascent | TrainingSession,
>(data: T[]): YearlyDaysCollection<T> {
  return groupDataByYear(data, {
    getFractionInYear: getWeeksInYear,
    getIndex: getWeekNumber,
  })
}

type GroupDataByYearOptions = {
  getIndex: (date: Date) => number
  getFractionInYear: (year: number) => number
}

function groupDataByYear<T extends StringDate = Ascent | TrainingSession>(
  data: T[],
  options: GroupDataByYearOptions,
): YearlyDaysCollection<T> {
  const { getIndex, getFractionInYear } = options

  const groupedItemByYear = initializeYearlyDataDaysCollection(
    data,
    getFractionInYear,
  )

  for (const item of data) {
    const date = new Date(item.date)
    const year = date.getFullYear()
    const index = getIndex(date)

    if (
      groupedItemByYear[year] === undefined ||
      groupedItemByYear[year][index] === undefined
    )
      continue

    groupedItemByYear[year][index].push(item)
  }

  return groupedItemByYear
}
