import { Temporal } from '@js-temporal/polyfill'
import type { TemporalDate } from '~/app/_components/qr-code/qr-code'
import { ascentSchema, type Ascent } from '~/types/ascent'
import { isDataResponse } from '~/types/generic'

const parsedAscentData = await fetch(
  'https://climbing-back.deno.dev/api/ascents',
)
  .then(response => response.json())
  .then(json => {
    if (!isDataResponse(json)) throw new Error('Invalid response')

    return ascentSchema.array().parse(json.data)
  })
  .catch(error => {
    console.error(error)
    return []
  })

const ascentSeasons = [
  ...new Set(parsedAscentData.map(({ date }) => date.year)),
].reverse()

const ascentsCollection: Record<
  number,
  (TemporalDate & { ascents?: Ascent[] })[]
> = Object.fromEntries(
  ascentSeasons.map(year => {
    const daysPerYear = 365
    return [
      year,
      Array.from({ length: daysPerYear })
        .fill(undefined)
        .map((_, i) => ({
          date: Temporal.PlainDate.from({
            day: 1,
            month: 1,
            year,
          }).add({ days: i }),
        })),
    ]
  }),
)

export const seasonAscent = parsedAscentData.reduce(
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
