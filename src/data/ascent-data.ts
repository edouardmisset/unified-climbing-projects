import { Temporal } from '@js-temporal/polyfill'
import { type Ascent, parseISODateToTemporal } from '~/schema/ascent'
import type { StringDateTime } from '~/types/generic'
import { createEmptyYearlyCollections } from './helpers.ts'

export const createYearList = <T extends Record<string, unknown>>(
  data: (T & { date: string })[],
) =>
  [
    ...new Set(data.map(({ date }) => parseISODateToTemporal(date).year)),
  ].reverse()

const getAscentsCollection: (
  ascents: Ascent[],
) => Record<number, (StringDateTime & { ascents?: Ascent[] })[]> = (
  ascents: Ascent[],
) => createEmptyYearlyCollections(createYearList(ascents))

export const getYearAscentPerDay = (ascents: Ascent[]) =>
  ascents.reduce(
    (acc, ascent) => {
      const date = parseISODateToTemporal(ascent.date)
      const { year, dayOfYear } = date
      const thisDay = acc[year]?.[dayOfYear - 1]

      if (acc[year] === undefined) return acc

      acc[year][dayOfYear - 1] = {
        date: date.toString(),
        ascents: [...(thisDay?.ascents ? [...thisDay.ascents] : []), ascent],
      }
      return acc
    },
    { ...getAscentsCollection(ascents) },
  )

export const createEmptyBarcodeCollection = <T extends Record<string, unknown>>(
  data: (T & { date: string })[],
) =>
  Object.fromEntries(
    createYearList(data).map(year => {
      const weeksPerYear = Temporal.PlainDate.from({
        year,
        month: 12,
        day: 31,
      }).weekOfYear
      return [year, Array.from({ length: weeksPerYear }, (): T[] => [])]
    }),
  )

export const getYearsAscentsPerWeek = (ascents: Ascent[]) =>
  ascents.reduce(
    (accumulator, ascent) => {
      const { year, weekOfYear } = parseISODateToTemporal(ascent.date)

      const weekAscents = accumulator[year]?.[weekOfYear]

      if (accumulator[year] === undefined) return accumulator

      accumulator[year][weekOfYear] = weekAscents
        ? [...weekAscents, ascent]
        : [ascent]

      return accumulator
    },
    { ...createEmptyBarcodeCollection<Ascent>(ascents) },
  )
