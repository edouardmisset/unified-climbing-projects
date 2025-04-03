import { frequencyBy } from './frequency-by'
import { sortNumericalValues } from './sort-values'

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24
const MILLISECONDS_IN_WEEK = 7 * MILLISECONDS_IN_DAY

export const getWeekNumber = (date: Date): number => {
  const firstDayOfWeek = 1 // Monday as the first day (0 = Sunday)
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  startOfYear.setDate(
    startOfYear.getDate() + (firstDayOfWeek - (startOfYear.getDay() % 7)),
  )
  return (
    Math.round(
      (date.getTime() - startOfYear.getTime()) / MILLISECONDS_IN_WEEK,
    ) + 1
  )
}

/**
 * Returns the number of weeks in the specified year.
 *
 * This function calculates the difference in weeks between the
 * first Monday of the given year and the first Monday of the next year.
 *
 * @param {number} year - The year to evaluate
 * @returns {number} The number of weeks in the specified year
 */
export const getWeeksInYear = (year: number): number => {
  const firstMondayThisYear = new Date(
    year,
    0,
    5 - (new Date(year, 0, 4).getDay() || 7),
  )

  const firstMondayNextYear = new Date(
    year + 1,
    0,
    5 - (new Date(year + 1, 0, 4).getDay() || 7),
  )

  return (
    (firstMondayNextYear.getTime() - firstMondayThisYear.getTime()) /
    MILLISECONDS_IN_WEEK
  )
}

/**
 * Returns the number of days in the specified year.
 *
 * @param {number} year - The year to evaluate
 * @returns {number} The number of days in the specified year
 */
export const getDaysInYear = (year: number): number => {
  const isLeap = new Date(year, 1, 29).getMonth() === 1
  return isLeap ? 366 : 365
}

/**
 * Returns the day of the year (1-based index) for the specified date.
 *
 * @param {Date} date - The date to evaluate
 * @returns {number} The day of the year
 */
export const getDayOfYear = (date: Date): number => {
  const newDate = new Date(date)
  return Math.floor(
    (newDate.getTime() - new Date(newDate.getFullYear(), 0, 0).getTime()) /
      MILLISECONDS_IN_DAY,
  )
}

/**
 * Returns the most frequent date from an array of objects containing a date field.
 *
 * @template Type
 * @param {Type[]} data - The array of objects that contain a 'date' string field
 * @returns {[string, number]} A tuple where the first element is the date and
 * the second element is the frequency
 */
export function getMostFrequentDate<Type extends { date: string }>(
  data: Type[],
): [string, number] {
  const dateFrequency = frequencyBy(data, 'date')
  const sortedDateByFrequency = sortNumericalValues(dateFrequency, {
    ascending: false,
  })
  return (Object.entries(sortedDateByFrequency)[0] ?? ['', 0]) as [
    string,
    number,
  ]
}
