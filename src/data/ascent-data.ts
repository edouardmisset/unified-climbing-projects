import { Temporal } from '@js-temporal/polyfill'
import type { Ascent } from '~/schema/ascent'
import type { TemporalDateTime } from '~/types/generic'
import { createEmptyYearlyCollections } from './helpers'

export const createSeasons = <T extends Record<string, unknown>>(
  data: (T & { date: Temporal.PlainDateTime })[],
) => [...new Set(data.map(({ date }) => date.year))].reverse()

const getAscentsCollection: (
  ascents: Ascent[],
) => Record<number, (TemporalDateTime & { ascents?: Ascent[] })[]> = (
  ascents: Ascent[],
) => createEmptyYearlyCollections(createSeasons(ascents))

export const getSeasonAscentPerDay = (ascents: Ascent[]) =>
  ascents.reduce(
    (acc, ascent) => {
      const { date } = ascent
      const { year, dayOfYear } = date
      const thisDay = acc[year]?.[dayOfYear - 1]

      if (acc[year] === undefined) return acc

      acc[year][dayOfYear - 1] = {
        date,
        ascents: [...(thisDay?.ascents ? [...thisDay.ascents] : []), ascent],
      }
      return acc
    },
    { ...getAscentsCollection(ascents) },
  )

export const createEmptyBarcodeCollection = <T extends Record<string, unknown>>(
  data: (T & { date: Temporal.PlainDateTime })[],
) =>
  Object.fromEntries(
    createSeasons(data).map(season => {
      const weeksPerYear = Temporal.PlainDate.from({
        year: season,
        month: 12,
        day: 31,
      }).weekOfYear
      return [season, Array.from({ length: weeksPerYear }, (): T[] => [])]
    }),
  )

export const getSeasonsAscentsPerWeek = (ascents: Ascent[]) =>
  ascents.reduce(
    (accumulator, ascent) => {
      const {
        date: { year, weekOfYear },
      } = ascent

      const weekAscents = accumulator[year]?.[weekOfYear]

      if (accumulator[year] === undefined) return accumulator

      accumulator[year][weekOfYear] = weekAscents
        ? [...weekAscents, ascent]
        : [ascent]

      return accumulator
    },
    { ...createEmptyBarcodeCollection<Ascent>(ascents) },
  )
