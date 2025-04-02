/**
 * Checks if a given date string represents a date within the last 12 months.
 *
 * The function creates a cutoff date for one year ago from now (with the time
 * set to midnight) and compares the input date against this range.
 *
 * @param {string} date - The date string to evaluate
 * @returns {boolean} True if the date is within the last 12 months, false
 * otherwise
 */
export function isDateInLast12Months(date: string): boolean {
  const now = new Date()
  const lastYear = new Date()
  lastYear.setFullYear(now.getFullYear() - 1)
  lastYear.setHours(0, 0, 0, 0)
  return lastYear <= new Date(date) && new Date(date) <= now
}
