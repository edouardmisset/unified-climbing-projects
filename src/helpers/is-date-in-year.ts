import { isValidDate } from '@edouardmisset/array/filter-by-date.ts'

/**
 * Checks if the provided date string corresponds to a date in the specified year.
 *
 * Converts the given string to a Date object and validates it using `isValidDate`.
 * If the date is invalid, logs an error message.
 *
 * @param {string} stringDate - The date represented as a string.
 * @param {number} year - The year to compare against.
 * @returns {boolean} True if the Date object's year matches the specified year;
 * otherwise, false.
 */
export function isDateInYear(stringDate: string, year: number): boolean {
  const date = new Date(stringDate)
  if (!isValidDate(date)) {
    globalThis.console.error(`${stringDate} is not a valid date`)
    return false
  }
  return date.getFullYear() === year
}
