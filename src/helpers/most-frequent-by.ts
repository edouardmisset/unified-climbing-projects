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
export function mostFrequentBy<
  Type extends Object_,
  Key extends keyof Type,
  Value = Type[Key],
>(records: Type[], property: Key): Value | undefined {
  if (records.length === 0) return

  const occurrenceMap = new Map<Value, number>()
  let mostFrequentValue: Value | undefined
  let highestCount = 0

  for (const record of records) {
    const value = record[property]
    if (value === undefined) continue

    const typedValue = value as Value
    const currentCount = (occurrenceMap.get(typedValue) ?? 0) + 1
    occurrenceMap.set(typedValue, currentCount)

    if (currentCount <= highestCount) continue

    highestCount = currentCount
    mostFrequentValue = typedValue
  }

  return mostFrequentValue
}
