import { capitalize } from '@edouardmisset/text'
import { isValidDate } from '@edouardmisset/date'
import 'temporal-polyfill/global'
import 'temporal-spec/global'
import { DAYS_IN_WEEK, NOON_HOUR, US_LOCALE } from '~/constants/generic'
import type { StringDate, ValueAndLabel } from '~/types/generic'
import { frequencyBy } from './frequency-by'
import { sortNumericalValues } from './sort-values'

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
// A known Monday, used as the base for generating weekday labels
const REFERENCE_MONDAY = Temporal.PlainDate.from('2024-01-01')

const englishRelativeDayFormatter = new Intl.RelativeTimeFormat(US_LOCALE, { numeric: 'auto' })

type WeekdayLabelStyle = 'long' | 'short'

/** Builds a calendar-only PlainDate from a Date's local year/month/day */
function toPlainDate(date: Date): Temporal.PlainDate {
  return Temporal.PlainDate.from({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  })
}

/** Converts a PlainDate to a Date set at noon, in the system's local time zone */
function plainDateToNoonDate(plainDate: Temporal.PlainDate): Date {
  const zonedDateTime = plainDate.toZonedDateTime({
    timeZone: Temporal.Now.timeZoneId(),
    plainTime: Temporal.PlainTime.from({ hour: NOON_HOUR }),
  })
  return new Date(zonedDateTime.epochMilliseconds)
}

/** Parses each unique `date` string into a PlainDate, dropping invalid entries, sorted ascending */
function toValidPlainDates(data: StringDate[]): Temporal.PlainDate[] {
  const uniqueDatesAsStrings = [...new Set(data.map(({ date }) => date))]

  return uniqueDatesAsStrings
    .map(dateString => {
      try {
        return Temporal.PlainDate.from(dateString)
      } catch {
        return undefined
      }
    })
    .filter(date => date !== undefined)
    .toSorted((a, b) => Temporal.PlainDate.compare(a, b))
}

export function formatEnglishWeekdayLabel(date: Date, style: WeekdayLabelStyle = 'short'): string {
  return toPlainDate(date).toLocaleString(US_LOCALE, { weekday: style })
}

export function getEnglishWeekdayLabels(style: WeekdayLabelStyle = 'short'): string[] {
  return Array.from({ length: DAYS_IN_WEEK }, (_, index) =>
    REFERENCE_MONDAY.add({ days: index }).toLocaleString(US_LOCALE, { weekday: style }),
  )
}

export function createRecentDateOptions(): ValueAndLabel[] {
  const lastSaturday = getLastSaturday()
  const lastSunday = getLastSunday()

  return [
    {
      label: capitalize(englishRelativeDayFormatter.format(-1, 'day')),
      value: fromDateToStringDate(getYesterday()),
    },
    {
      label: `Last ${formatEnglishWeekdayLabel(lastSaturday, 'long')}`,
      value: fromDateToStringDate(lastSaturday),
    },
    {
      label: `Last ${formatEnglishWeekdayLabel(lastSunday, 'long')}`,
      value: fromDateToStringDate(lastSunday),
    },
  ]
}

export const getWeekNumber = (date: Date): number => {
  const { weekOfYear } = toPlainDate(date)
  if (weekOfYear === undefined) throw new Error('Unable to compute week of year')
  return weekOfYear
}

/**
 * Returns the number of ISO weeks in the specified year.
 *
 * December 28th always falls in the last ISO week of the year, so its week
 * number is the total number of weeks in that year.
 *
 * @param {number} year - The year to evaluate
 * @returns {number} The number of weeks in the specified year
 */
export const getWeeksInYear = (year: number): number => {
  const { weekOfYear } = Temporal.PlainDate.from({ year, month: 12, day: 28 })
  if (weekOfYear === undefined) throw new Error('Unable to compute weeks in year')
  return weekOfYear
}

/**
 * Returns the number of days in the specified year.
 *
 * @param {number} year - The year to evaluate
 * @returns {number} The number of days in the specified year
 */
export const getDaysInYear = (year: number): number =>
  Temporal.PlainYearMonth.from({ year, month: 1 }).daysInYear

/**
 * Returns the day of the year (1-based index) for the specified date.
 *
 * @param {Date} date - The date to evaluate
 * @returns {number} The day of the year
 */
export const getDayOfYear = (date: Date): number => toPlainDate(date).dayOfYear

/**
 * Returns the most frequent date from an array of objects containing a date field.
 *
 * @param {StringDate[]} data - The array of objects that contain a 'date' string field
 * @returns {[string, number]} A tuple where the first element is the date and
 * the second element is the frequency
 */
export function getMostFrequentDate(data: StringDate[]): [string, number] {
  const dateFrequency = frequencyBy(data, 'date')
  const sortedDateByFrequency = sortNumericalValues(dateFrequency, {
    ascending: false,
  })
  const [firstEntry] = Object.entries(sortedDateByFrequency)

  if (!firstEntry) return ['', 0]

  const [date, count] = firstEntry

  return typeof count === 'number' ? [date, count] : ['', 0]
}

/**
 * Returns a new Date object set to noon (12:00:00.000) of the given date.
 * @param {Date} date - The date to normalize
 * @returns {Date} The normalized date at noon
 */
export function getDateAtNoon(date: Date): Date {
  return plainDateToNoonDate(toPlainDate(date))
}

/**
 * Returns a Date object representing yesterday at noon.
 * @returns {Date} Yesterday's date at noon
 */
export function getYesterday(): Date {
  return plainDateToNoonDate(Temporal.Now.plainDateISO().subtract({ days: 1 }))
}

/**
 * Returns a Date object representing the most recent Saturday at noon.
 * If today is Saturday, returns last week's Saturday.
 * @returns {Date} Last Saturday at noon
 */
export function getLastSaturday(): Date {
  const today = Temporal.Now.plainDateISO()
  // dayOfWeek is ISO (Monday=1..Sunday=7); shift so Saturday itself maps to 7
  const daysSinceSaturday = (today.dayOfWeek % DAYS_IN_WEEK) + 1
  return plainDateToNoonDate(today.subtract({ days: daysSinceSaturday }))
}

/**
 * Returns a Date object representing the most recent Sunday at noon.
 * If today is Sunday, returns last week's Sunday.
 * @returns {Date} Last Sunday at noon
 */
export function getLastSunday(): Date {
  const today = Temporal.Now.plainDateISO()
  // dayOfWeek is ISO (Monday=1..Sunday=7), which already equals days-since-last-Sunday
  return plainDateToNoonDate(today.subtract({ days: today.dayOfWeek }))
}

/**
 * Returns an ISO date string (YYYY-MM-DD) from a Date object.
 * Throws if the date is invalid.
 *
 * @param {Date} date - The date to convert
 * @returns {string} The ISO date string (YYYY-MM-DD)
 */
export function fromDateToStringDate(date: Date): string {
  if (!isValidDate(date)) throw new Error('Invalid date')

  return Temporal.Instant.fromEpochMilliseconds(date.getTime())
    .toZonedDateTimeISO('UTC')
    .toPlainDate()
    .toString()
}

/**
 * Extracts the date portion (YYYY-MM-DD) from an ISO 8601 string.
 * Throws if the input is not a string or is not a valid ISO date string.
 *
 * @param {string} isoDate - The ISO 8601 date string
 * @returns {string} The date portion (YYYY-MM-DD)
 */
export function extractDateFromISODateString(isoDate: string): string {
  if (isoDate.length < 10) throw new Error('Invalid ISO date string')

  const datePart = isoDate.slice(0, 10)
  if (!ISO_DATE_REGEX.test(datePart)) throw new Error('Invalid ISO date string')

  try {
    return Temporal.PlainDate.from(datePart).toString()
  } catch {
    throw new Error('Invalid ISO date string')
  }
}

/**
 * Finds the longest consecutive streak of dates in the provided data.
 *
 * A streak is defined as consecutive days without gaps. The function counts
 * unique dates only, so multiple entries on the same date are treated as one.
 *
 * @param {StringDate[]} data - Array of objects containing date strings in ISO format
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
export function findLongestStreak(data: StringDate[]): number {
  if (data.length === 0) return 0

  const sortedDates = toValidPlainDates(data)

  if (sortedDates.length === 0) return 0
  if (sortedDates.length === 1) return 1

  let maxStreak = 1
  let currentStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i]
    const previousDate = sortedDates[i - 1]

    if (currentDate === undefined || previousDate === undefined) continue

    const isConsecutive = previousDate.until(currentDate, { largestUnit: 'days' }).days === 1

    if (isConsecutive) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else currentStreak = 1
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
 * @param {StringDate[]} data - Array of objects containing date strings in ISO format
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
export function findLongestGap(data: StringDate[]): number {
  if (data.length <= 1) return 0

  const sortedDates = toValidPlainDates(data)

  if (sortedDates.length <= 1) return 0

  let maxGap = 0

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i]
    const previousDate = sortedDates[i - 1]

    if (currentDate === undefined || previousDate === undefined) continue

    const gapInDays = previousDate.until(currentDate, { largestUnit: 'days' }).days - 1

    if (gapInDays > 0) maxGap = Math.max(maxGap, gapInDays)
  }

  return maxGap
}
