import { isDateInYear } from '@edouardmisset/date/is-date-in-year.ts'
import { stringEqualsCaseInsensitive } from '@edouardmisset/text'

export function matchesValue<T>(actual: T | undefined, expected: T | undefined): boolean {
  return expected === undefined || actual === expected
}

export function matchesText(actual: string, expected: string | undefined): boolean {
  return expected === undefined || stringEqualsCaseInsensitive(actual, expected)
}

export function matchesYear(date: Date, year: number | undefined): boolean {
  return year === undefined || isDateInYear(date, year)
}
