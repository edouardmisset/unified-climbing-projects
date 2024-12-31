import { frequencyBy } from './frequency-by'
import { sortNumericalValues } from './sort-values'

const localeIdentifier = 'en-US'

const MILLISECONDS_IN_WEEK = 604_800_000
const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24

export const DATE_TIME_OPTIONS = {
  fullDateTime: {
    dateStyle: 'full',
    timeStyle: 'medium',
  },
  shortDateTime: {
    weekday: 'short',
    hour: 'numeric',
  },
  shortDate: {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  },
  longDate: {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>

/**
 * Formats the provided date using the specified date time options.
 *
 * @param {Date} date - The date to format
 * @param {keyof typeof DATE_TIME_OPTIONS} [options='fullDateTime'] - The format option key from DATE_TIME_OPTIONS
 * @returns {string} The formatted date string
 */
export const formatDateTime = (
  date: Date,
  options: keyof typeof DATE_TIME_OPTIONS = 'fullDateTime',
): string => {
  return new Intl.DateTimeFormat(
    localeIdentifier,
    DATE_TIME_OPTIONS[options],
  ).format(date)
}

export const getWeek = (date: Date): number => {
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
    +year,
    0,
    5 - (new Date(+year, 0, 4).getDay() || 7),
  )

  const firstMondayNextYear = new Date(
    +year + 1,
    0,
    5 - (new Date(+year + 1, 0, 4).getDay() || 7),
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
  const ascentsByDate = frequencyBy(data, 'date')
  const sortedAscentsByDate = sortNumericalValues(ascentsByDate, {
    ascending: false,
  })
  return (Object.entries(sortedAscentsByDate)[0] ?? ['', 0]) as [string, number]
}
