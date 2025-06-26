import {
  getDayOfYear,
  getDaysInYear,
  getWeekNumber,
  getWeeksInYear,
} from '~/helpers/date'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import type { StringDate } from '~/types/generic'

export function createYearList<T extends StringDate = TrainingSession | Ascent>(
  data: T[],
  options?: { descending?: boolean },
) {
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
function initializeYearlyDataDaysCollection<
  T extends StringDate = TrainingSession | Ascent,
>(
  data: T[],
  getFractionInYear: (year: number) => number,
): YearlyDaysCollection<T> {
  const years = createYearList(data)
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
