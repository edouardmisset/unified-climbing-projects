import type { Object_ } from '~/types/generic'

/**
 * Finds the most frequently occurring value for a specific property in an array
 * of records.
 *
 * @template Type - Type of the records in the array
 * @template Key - Type of the property key (must be a key of Type)
 * @param {Type[]} records - The array of records to analyze
 * @param {Key} property - The property key to count occurrences by
 * @returns {Type[Key] | undefined} The most frequent value, or undefined if no
 * records exist
 *
 * @example
 * // Returns the most common wall profile among ascents
 * const mostCommonProfile = mostFrequentBy(ascents, 'profile');
 */
export function mostFrequentBy<Type extends Object_, Key extends keyof Type>(
  records: Type[],
  property: Key,
): Type[Key] | undefined {
  if (records.length === 0) return

  const occurrenceMap = new Map<Type[Key], number>()
  let mostFrequentValue: Type[Key] | undefined = undefined
  let highestCount = 0

  for (const record of records) {
    const value = record[property]
    if (value === undefined || value === null) continue

    const currentCount = (occurrenceMap.get(value) ?? 0) + 1
    occurrenceMap.set(value, currentCount)

    if (currentCount <= highestCount) continue

    highestCount = currentCount
    mostFrequentValue = value
  }

  return mostFrequentValue
}
