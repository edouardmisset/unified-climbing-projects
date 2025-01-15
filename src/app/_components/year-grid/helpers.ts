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

export function getNumberOfDaysInYear(year: number): number {
  return (
    (new Date(year + 1, 0, 1, 12).getTime() -
      new Date(year, 0, 1, 12).getTime()) /
    (1000 * 60 * 60 * 24)
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
