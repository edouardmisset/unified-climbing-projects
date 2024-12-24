/**
 * Compares two dates to check if they are equal.
 *
 * @param {Date} leftDate - The first date to compare.
 * @param {Date} [rightDate=new Date()] - The second date to compare. Defaults to the current date.
 * @returns {boolean} True if the dates are equal, false otherwise.
 */
export function datesEqual(leftDate: Date, rightDate = new Date()): boolean {
  return (
    leftDate.getDate() === rightDate.getDate() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getFullYear() === rightDate.getFullYear()
  )
}

/**
 * Gets the week number of the year for a given date.
 *
 * @param {Date} date - The date for which to get the week number.
 * @returns {number} The week number of the year.
 */
export function getWeek(date: Date): number {
  const firstDayOfJanuary = new Date(date.getFullYear(), 0, 1)
  const daysToNextMonday =
    firstDayOfJanuary.getDay() === 1 ? 0 : (7 - firstDayOfJanuary.getDay()) % 7
  const nextMonday = new Date(
    date.getFullYear(),
    0,
    firstDayOfJanuary.getDate() + daysToNextMonday,
  )

  return date.getTime() < nextMonday.getTime()
    ? 52
    : date.getTime() > nextMonday.getTime()
      ? Math.ceil(
          (date.getTime() - nextMonday.getTime()) / (24 * 3600 * 1000) / 7,
        )
      : 1
}

/**
 * Gets the number of ISO weeks in a given year.
 *
 * @param {number} year - The year for which to get the number of ISO weeks.
 * @returns {number} The number of ISO weeks in the year.
 */
export function getISOWeeksInYear(year: number): number {
  const fourthJan = new Date(year, 0, 4)
  const fourthJanDay = fourthJan.getDay()
  const firstThursday = fourthJanDay <= 4 ? fourthJanDay : fourthJanDay - 7
  const firstWeekStart = new Date(year, 0, 4 - firstThursday)
  const lastDayOfYear = new Date(year, 11, 31)
  const daysInYear =
    (lastDayOfYear.getTime() - firstWeekStart.getTime()) / (1000 * 60 * 60 * 24)
  return Math.ceil((daysInYear + 1) / 7)
}

/**
 * Checks if the first day of the year is in the first ISO week of the year.
 *
 * @param {number} year - The year to check.
 * @returns {boolean} True if the first day of the year is in the first ISO week, false otherwise.
 */
export function isFirstDayInFirstISOWeek(year: number): boolean {
  const firstDayOfYear = new Date(year, 0, 1)
  const fourthJan = new Date(year, 0, 4)
  const dayOfWeek = fourthJan.getDay()
  const firstISOWeekStart = new Date(
    year,
    0,
    4 - (dayOfWeek <= 4 ? dayOfWeek - 1 : dayOfWeek - 8),
  )
  return (
    firstDayOfYear >= firstISOWeekStart &&
    firstDayOfYear <
      new Date(firstISOWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
  )
}

export const isDateInFirstWeek = (date: Date): boolean => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const firstWeekMonday = new Date(
    firstDayOfYear.getTime() +
      (8 - firstDayOfYear.getDay()) * 24 * 60 * 60 * 1000,
  )
  return date >= firstDayOfYear && date < firstWeekMonday
}
