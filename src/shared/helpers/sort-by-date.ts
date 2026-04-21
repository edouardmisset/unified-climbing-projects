import { isValidDate } from '@edouardmisset/date'

/**
 * Sorts objects by their date property.
 *
 * @defaults isDescending to true (newest first)
 *
 * @template T - Object type containing a date string property
 * @param {T} a - First object to compare
 * @param {T} b - Second object to compare
 * @param {boolean} [isDescending=true] - Sort direction (true = newest first,
 * false = oldest first)
 * @returns {number} Comparison result: negative (a before b), positive (a after
 * b), or zero (equal)
 *
 * @example
 * // Sort chronologically (oldest first)
 * const oldestFirst = ascents.sort((a, b) => sortByDate(a, b, false));
 *
 * @example
 * // Sort by date (newest first - default behavior)
 * const newestFirst = ascents.sort(sortByDate);
 *
 * @example
 * // Usage with custom objects
 * const events = [
 *   { id: 1, date: '2025-01-15', title: 'Meeting' },
 *   { id: 2, date: '2025-01-10', title: 'Call' }
 * ];
 * const sortedEvents = events.sort(sortByDate);
 */
export function sortByDate<T extends { date: string }>(
  { date: aStringDate }: T,
  { date: bStringDate }: T,
  isDescending = true,
): number {
  if (aStringDate === bStringDate) return 0

  const directionMultiplier = isDescending ? -1 : 1

  const aDate = new Date(aStringDate)
  const bDate = new Date(bStringDate)

  if (!isValidDate(aDate, bDate)) {
    console.error('Invalid date format detected:', { aStringDate, bStringDate })
    return 0
  }

  const aTime = aDate.getTime()
  const bTime = bDate.getTime()

  return directionMultiplier * (aTime - bTime)
}
