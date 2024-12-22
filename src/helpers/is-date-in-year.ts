import { isValidDate } from '@edouardmisset/array'

export function isDateInYear(stringDate: string, year: number): boolean {
  const date = new Date(stringDate)
  if (!isValidDate(date)) {
    globalThis.console.error(`${stringDate} is not a valid date`)
  }
  return date?.getFullYear() === year
}
