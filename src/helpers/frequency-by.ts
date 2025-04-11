import { sortNumericalValues } from './sort-values.ts'

export function frequencyBy<
  Object_ extends Record<string, string | number>,
  Key extends keyof Object_,
>(
  array: Object_[],
  key: Key,
  options?: { ascending: boolean },
): Record<Object_[Key], number> {
  const { ascending } = options ?? {}

  const validItems = array.filter(item => item[key] != null)
  const distinctValues = [...new Set(validItems.map(item => item[key]))]

  const frequencyCount = Object.fromEntries(
    distinctValues.map(value => {
      const count = validItems.filter(item => item[key] === value).length
      return [value, count]
    }),
  ) as Record<Object_[Key], number>

  return ascending === undefined
    ? frequencyCount
    : sortNumericalValues(frequencyCount, { ascending })
}
