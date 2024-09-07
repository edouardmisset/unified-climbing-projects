import type { TemporalDate } from '~/app/_components/qr-code/qr-code'
import { ascentSchema, type Ascent } from '~/types/ascent'
import { isDataResponse } from '~/types/generic'
import { createEmptyYearlyCollections } from './helpers'
import { Temporal } from '@js-temporal/polyfill'

const parsedAscentData = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/ascents`,
)
  .then(response => response.json())
  .then(json => {
    if (!isDataResponse(json)) throw new Error('Invalid response')

    return ascentSchema.array().parse(json.data)
  })
  .catch(error => {
    console.error(error)
    return [] as Ascent[]
  })

export const ascentSeasons = [
  ...new Set(parsedAscentData.map(({ date }) => date.year)),
].reverse()

const ascentsCollection: Record<
  number,
  (TemporalDate & { ascents?: Ascent[] })[]
> = createEmptyYearlyCollections(ascentSeasons)

export const seasonAscentPerDay = parsedAscentData.reduce(
  (acc, ascent) => {
    const { date } = ascent
    const { year, dayOfYear } = date
    const thisDay = acc[year]?.[dayOfYear - 1]

    acc[year]![dayOfYear - 1] = {
      date,
      ascents: [...(thisDay?.ascents ? [...thisDay.ascents] : []), ascent],
    }
    return acc
  },
  { ...ascentsCollection },
)

export const createEmptyBarcodeCollection = <T>() =>
  Object.fromEntries(
    ascentSeasons.map(season => {
      const weeksPerYear = Temporal.PlainDate.from({ year: season, month: 12, day: 31 }).weekOfYear
      return [season, Array.from({ length: weeksPerYear }, (): T[] => [])]
    }),
  )

export const seasonsAscentsPerWeek = parsedAscentData.reduce(
  (accumulator, ascent) => {
    const {
      date: { year, weekOfYear },
    } = ascent

    const weekAscents = accumulator[year]?.[weekOfYear]
    accumulator[year]![weekOfYear] =
      weekAscents ? [...weekAscents, ascent] : [ascent]

    return accumulator
  },
  { ...createEmptyBarcodeCollection<Ascent>() },
)
