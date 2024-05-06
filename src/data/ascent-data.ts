import { Temporal } from "@js-temporal/polyfill"
import type { TemporalDate } from "~/app/_components/qr-code/qr-code"
import { ascentSchema, type Ascent } from "~/types/ascent"

import ascentData from '~/data/all-successes.json'

const parsedAscentData = ascentSchema.array().parse(ascentData)

const ascentSeasons = [
  ...new Set(parsedAscentData.map(({ date }) => date.year)),
]
  .filter(s => s !== Temporal.Now.plainDateISO().year)
  .reverse()

const ascentQRCodeCollection: Record<
  number,
  (TemporalDate & { ascents?: Ascent[] })[]
> = Object.fromEntries(
  ascentSeasons.map(season => {
    const daysPerYear = 365
    return [
      season,
      Array.from({ length: daysPerYear })
        .fill(undefined)
        .map((_, i) => ({
          date: Temporal.PlainDate.from({
            day: 1,
            month: 1,
            year: season,
          }).add({ days: i }),
        })),
    ]
  }),
)

export const seasonAscent = parsedAscentData
  .filter(({ date }) => Temporal.Now.plainDateISO().year !== date.year)
  .reduce(
    (acc, ascent) => {
      const { date } = ascent
      const thisDay = acc[date.year]![date.dayOfYear - 1]
      acc[date.year]![date.dayOfYear - 1] = {
        date,
        ascents: [...(thisDay?.ascents ? [...thisDay.ascents] : []), ascent],
      }
      return acc
    },
    { ...ascentQRCodeCollection },
  )
