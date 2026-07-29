import { sortNumericalValues } from './sort-values.ts'

export function frequencyBy<Object_ extends Record<string, string | number>>(
  array: Object_[],
  key: keyof Object_,
  options?: { ascending: boolean },
): Record<string, number> {
  const { ascending } = options ?? {}

  const validItems = array.filter(item => item[key] !== undefined)
  const distinctValues = [...new Set(validItems.map(item => item[key]))]

  const frequencyCount: Record<string, number> = {}
  for (const value of distinctValues) {
    const count = validItems.filter(item => item[key] === value).length
    frequencyCount[String(value)] = count
  }

  return ascending === undefined
    ? frequencyCount
    : sortNumericalValues(frequencyCount, { ascending })
}
