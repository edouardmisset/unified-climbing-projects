import { sortNumericalValues } from './sort-values.ts'

export function frequencyBy<
  Object_ extends Record<string, string | number>,
  Key extends keyof Object_,
>(array: Object_[], key: Key, options?: { ascending: boolean }): Record<string, number> {
  const { ascending } = options ?? {}

  const validItems = array.filter(item => item[key] != null)
  const distinctValues = [...new Set(validItems.map(item => item[key]))]

  const frequencyCount: Record<string, number> = Object.create(null)
  for (const value of distinctValues) {
    const count = validItems.filter(item => item[key] === value).length
    frequencyCount[String(value)] = count
  }

  return ascending === undefined
    ? frequencyCount
    : sortNumericalValues(frequencyCount, { ascending })
}
