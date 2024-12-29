import { getDaysInYear } from '~/helpers/date'
import type { StringDateTime } from '~/types/generic'

export function createEmptyYearlyCollections(
  listOfYears: number[],
): Record<number, StringDateTime[]> {
  return Object.fromEntries(
    listOfYears.map(year => {
      const daysPerYear = getDaysInYear(year)

      return [
        year,
        Array.from({ length: daysPerYear }).map((_, i) => ({
          date: new Date(year, 0, i + 1).toString(),
        })),
      ]
    }),
  )
}
