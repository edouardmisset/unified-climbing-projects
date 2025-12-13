import type { StringDate } from '~/types/generic'
import type { CalendarCellRender, DayTransform, GroupedData } from './types'

// Constants for date calculations
const FEBRUARY_MONTH = 1
const LEAP_YEAR_TEST_DAY = 29
const DAYS_IN_LEAP_YEAR = 366
const DAYS_IN_REGULAR_YEAR = 365
const MILLISECONDS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const HOURS_PER_DAY = 24
const MILLISECONDS_PER_DAY =
  MILLISECONDS_PER_SECOND *
  SECONDS_PER_MINUTE *
  MINUTES_PER_HOUR *
  HOURS_PER_DAY

/**
 * Get the number of days in a year
 */
export function getDaysInYear(year: number): number {
  const isLeap =
    new Date(year, FEBRUARY_MONTH, LEAP_YEAR_TEST_DAY).getMonth() ===
    FEBRUARY_MONTH
  return isLeap ? DAYS_IN_LEAP_YEAR : DAYS_IN_REGULAR_YEAR
}

/**
 * Get the day of the year (1-based index) for the specified date
 */
function getDayOfYear(date: Date): number {
  const newDate = new Date(date)
  return Math.floor(
    (newDate.getTime() - new Date(newDate.getFullYear(), 0, 0).getTime()) /
      MILLISECONDS_PER_DAY,
  )
}

/**
 * Groups data by year and day of year
 */
export function groupDataByYear<T extends StringDate>(
  data: T[],
): GroupedData<T> {
  const grouped: GroupedData<T> = {}

  // Get all unique years from the data
  const years = [
    ...new Set(data.map(item => new Date(item.date).getFullYear())),
  ]

  // Initialize empty arrays for each day of each year
  for (const year of years) {
    const daysInYear = getDaysInYear(year)
    grouped[year] = Array.from({ length: daysInYear }, () => [])
  }

  // Group data by year and day
  for (const item of data) {
    const date = new Date(item.date)
    const year = date.getFullYear()
    const dayOfYear = getDayOfYear(date) - 1 // Convert to 0-based index

    if (grouped[year]?.[dayOfYear]) {
      grouped[year][dayOfYear].push(item)
    }
  }

  return grouped
}

/**
 * Transforms grouped data to calendar entries using provided configuration
 */
export function transformToCalendarEntries<T extends StringDate>(
  year: number,
  groupedData: T[][],
  transformDay: DayTransform<T>,
  maxCount: number,
): CalendarCellRender[] {
  return groupedData.map((dayData, index): CalendarCellRender => {
    const date = new Date(Date.UTC(year, 0, index + 1, 12)).toISOString()

    return transformDay({
      items: dayData,
      date,
      dayIndex: index,
      maxCount,
    })
  })
}

/**
 * Default transformation function that can be used for most common cases
 */
export function defaultTransform<T extends StringDate>(
  year: number,
  data: T[],
  transformDay: DayTransform<T>,
): CalendarCellRender[] {
  const grouped = groupDataByYear(data)
  let yearData = grouped[year]

  if (!yearData) {
    const daysInYear = getDaysInYear(year)
    yearData = Array.from({ length: daysInYear }, () => [])
  }

  const maxCount = Math.max(...yearData.map(day => day.length), 0)

  return transformToCalendarEntries(year, yearData, transformDay, maxCount)
}
