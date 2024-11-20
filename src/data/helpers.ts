import { Temporal } from '@js-temporal/polyfill'
import type { TemporalDateTime } from '~/types/generic'

export function createEmptyYearlyCollections(
  listOfYears: number[],
): Record<number, TemporalDateTime[]> {
  return Object.fromEntries(
    listOfYears.map(year => {
      const daysPerYear = Temporal.PlainDateTime.from({
        year,
        month: 1,
        day: 1,
      }).daysInYear

      return [
        year,
        Array.from({ length: daysPerYear })
          .fill(undefined)
          .map((_, i) => ({
            date: Temporal.PlainDateTime.from({
              day: 1,
              month: 1,
              year,
            }).add({ days: i }),
          })),
      ]
    }),
  )
}
