import { isValidDate } from '@edouardmisset/date'
import { DAYS_IN_WEEK } from '~/constants/generic'
import type { StringDate, ValueAndLabel } from '~/types/generic'
import { frequencyBy } from './frequency-by'
import { sortNumericalValues } from './sort-values'

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24
const MILLISECONDS_IN_WEEK = DAYS_IN_WEEK * MILLISECONDS_IN_DAY

export function createRecentDateOptions(): ValueAndLabel[] {
  return [
    { label: 'Yesterday', value: fromDateToStringDate(getYesterday()) },
    {
      label: 'Last Saturday',
      value: fromDateToStringDate(getLastSaturday()),
    },
    {
      label: 'Last Sunday',
      value: fromDateToStringDate(getLastSunday()),
    },
  ]
}

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

/**
 * Returns a new Date object set to noon (12:00:00.000) of the given date.
 * @param {Date} date - The date to normalize
 * @returns {Date} The normalized date at noon
 */
export function getDateAtNoon(date: Date): Date {
  const normalized = new Date(date)
  normalized.setHours(12, 0, 0, 0)
  return normalized
}

/**
 * Returns a Date object representing yesterday at noon.
 * @returns {Date} Yesterday's date at noon
 */
export function getYesterday(): Date {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  return getDateAtNoon(yesterday)
}

/**
 * Returns a Date object representing the most recent Saturday at noon.
 * If today is Saturday, returns last week's Saturday.
 * @returns {Date} Last Saturday at noon
 */
export function getLastSaturday(): Date {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = Sunday, 6 = Saturday
  // If today is Saturday (6), go back 7 days; else, go back to last Saturday
  const daysSinceSaturday = dayOfWeek === 6 ? DAYS_IN_WEEK : dayOfWeek + 1
  const lastSaturday = new Date(now)
  lastSaturday.setDate(now.getDate() - daysSinceSaturday)
  return getDateAtNoon(lastSaturday)
}

/**
 * Returns a Date object representing the most recent Sunday at noon.
 * If today is Sunday, returns last week's Sunday.
 * @returns {Date} Last Sunday at noon
 */
export function getLastSunday(): Date {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = Sunday
  // If today is Sunday (0), go back 7 days; else, go back to last Sunday
  const daysSinceSunday = dayOfWeek === 0 ? DAYS_IN_WEEK : dayOfWeek
  const lastSunday = new Date(now)
  lastSunday.setDate(now.getDate() - daysSinceSunday)
  return getDateAtNoon(lastSunday)
}

/**
 * Returns an ISO date string (YYYY-MM-DD) from a Date object.
 * Throws if the date is invalid.
 *
 * @param {Date} date - The date to convert
 * @returns {string} The ISO date string (YYYY-MM-DD)
 */
export function fromDateToStringDate(date: Date): string {
  if (!isValidDate(date)) {
    throw new Error('Invalid date')
  }

  const isoDateString = date.toISOString()
  return extractDateFromISODateString(isoDateString)
}

/**
 * Extracts the date portion (YYYY-MM-DD) from an ISO 8601 string.
 * Throws if the input is not a string or is not a valid ISO date string.
 *
 * @param {string} isoDate - The ISO 8601 date string
 * @returns {string} The date portion (YYYY-MM-DD)
 */
export function extractDateFromISODateString(isoDate: string): string {
  if (isoDate.length < 10) {
    throw new Error('Invalid ISO date string')
  }

  const datePart = isoDate.slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    throw new Error('Invalid ISO date string')
  }
  return datePart
}

/**
 * Finds the longest consecutive streak of dates in the provided data.
 *
 * A streak is defined as consecutive days without gaps. The function counts
 * unique dates only, so multiple entries on the same date are treated as one.
 *
 * @template T - Type extending StringDate with a date property
 * @param {T[]} data - Array of objects containing date strings in ISO format
 * (YYYY-MM-DD)
 * @returns {number} The length of the longest consecutive streak of dates
 *
 * @example
 * ```typescript
 * const activities = [
 *   { date: '2024-01-01', activity: 'climb' },
 *   { date: '2024-01-02', activity: 'climb' },
 *   { date: '2024-01-03', activity: 'climb' },
 *   { date: '2024-01-05', activity: 'climb' } // Gap here
 * ];
 * const streak = findLongestStreak(activities); // Returns 3
 * ```
 */
export function findLongestStreak<T extends StringDate>(data: T[]): number {
  if (data.length === 0) return 0

  const uniqueDatesAsStrings = [...new Set(data.map(({ date }) => date))]
  const sortedDates = uniqueDatesAsStrings
    .map(dateString => new Date(dateString))
    .filter(date => isValidDate(date))
    .sort((a, b) => a.getTime() - b.getTime())

  if (sortedDates.length === 0) return 0
  if (sortedDates.length === 1) return 1

  let maxStreak = 1
  let currentStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i]
    const previousDate = sortedDates[i - 1]

    if (currentDate === undefined || previousDate === undefined) continue

    const timeDifference = currentDate.getTime() - previousDate.getTime()
    const isConsecutive = timeDifference === MILLISECONDS_IN_DAY

    if (isConsecutive) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return maxStreak
}

/**
 * Finds the longest gap (in days) between consecutive dates in the provided data.
 *
 * A gap is defined as the number of days between two consecutive dates minus 1.
 * For example, if you have activities on 2024-01-01 and 2024-01-05, the gap is
 * 3 days.
 * The function counts unique dates only, so multiple entries on the same date
 * are treated as one.
 *
 * @template T - Type extending StringDate with a date property
 * @param {T[]} data - Array of objects containing date strings in ISO format
 * (YYYY-MM-DD)
 * @returns {number} The length of the longest gap between consecutive dates in
 * days, or 0 if no gaps exist
 *
 * @example
 * ```typescript
 * const activities = [
 *   { date: '2024-01-01', activity: 'climb' },
 *   { date: '2024-01-02', activity: 'climb' },
 *   { date: '2024-01-07', activity: 'climb' }, // 4-day gap (Jan 3-6)
 *   { date: '2024-01-15', activity: 'climb' }  // 7-day gap (Jan 8-14)
 * ];
 * const longestGap = findLongestGap(activities); // Returns 7
 * ```
 */
export function findLongestGap<T extends StringDate>(data: T[]): number {
  if (data.length <= 1) return 0

  const uniqueDatesAsStrings = [...new Set(data.map(({ date }) => date))]
  const sortedDates = uniqueDatesAsStrings
    .map(dateString => new Date(dateString))
    .filter(date => isValidDate(date))
    .sort((a, b) => a.getTime() - b.getTime())

  if (sortedDates.length <= 1) return 0

  let maxGap = 0

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i]
    const previousDate = sortedDates[i - 1]

    if (currentDate === undefined || previousDate === undefined) continue

    const timeDifference = currentDate.getTime() - previousDate.getTime()
    const gapInDays = Math.floor(timeDifference / MILLISECONDS_IN_DAY) - 1

    if (gapInDays > 0) {
      maxGap = Math.max(maxGap, gapInDays)
    }
  }

  return maxGap
}
