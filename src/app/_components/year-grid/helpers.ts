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

export function getNumberOfDaysInYear(year: number): number {
  return (
    (new Date(year + 1, 0, 1, 12).getTime() - new Date(year, 0, 1, 12).getTime()) /
    (1000 * 60 * 60 * 24)
  )
}
