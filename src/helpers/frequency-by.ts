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

  const frequencyCount = array
    .filter(item => item[key] !== null && item[key] !== undefined)
    .reduce(
      (frequencyCounter, object_) => {
        frequencyCounter[object_[key]] =
          (frequencyCounter[object_[key]] ?? 0) + 1
        return frequencyCounter
      },
      {} as Record<Object_[Key], number>,
    )
  return ascending === undefined
    ? frequencyCount
    : sortNumericalValues(frequencyCount, { ascending })
}
