import type { StringDate } from '~/types/generic'
import { extractDateFromISODateString } from './date'

/**
 * Extracts unique dates from a list of items with date properties
 *
 * @param {Array<StringDate>} itemsWithDate - The list of items with date properties
 * @returns {number} The count of unique dates
 */
export function countUniqueDates(itemsWithDate: StringDate[]): number {
  return new Set(
    itemsWithDate.map(({ date }) => extractDateFromISODateString(date)),
  ).size
}
