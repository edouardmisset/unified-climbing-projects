import { Suspense } from 'react'
import { getMostFrequentDate } from '~/helpers/date'
import { formatDateTime } from '~/helpers/format-date'
import type { Ascent } from '~/schema/ascent'
import { api } from '~/trpc/server'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'
import { Card } from '../../card/card'

export async function DaysOutsideSummary({
  ascents,
  year,
}: {
  ascents: Ascent[]
  year?: number
}) {
  const outdoorSessions = await api.training.getAll({
    sessionType: 'Out',
    year,
  })

  const daysOutside = outdoorSessions.length

  const numberOfAscents = ascents.length

  if (numberOfAscents === 0 || daysOutside === 0) return undefined

  const [mostAscentDate] = getMostFrequentDate(ascents)

  const ascentsInMostAscentDay = ascents.filter(
    ({ date }) =>
      new Date(date).getTime() === new Date(mostAscentDate).getTime(),
  )

  const ascentsRatio = (numberOfAscents / daysOutside).toFixed(1)

  return (
    <Card>
      <h2>Days outside</h2>
      <Suspense
        fallback={
          <p>
            <strong>Loading...</strong>
          </p>
        }
      >
        <DaysOutsideDetails
          ascents={ascents}
          ascentsRatio={ascentsRatio}
          daysOutside={daysOutside}
        />
      </Suspense>
      {mostAscentDate === '' ||
      ascentsInMostAscentDay.length === 0 ? undefined : (
        <p>
          Your best day was{' '}
          <strong>
            {formatDateTime(new Date(mostAscentDate), 'longDate')}
          </strong>{' '}
          where you climbed{' '}
          <AscentsWithPopover ascents={ascentsInMostAscentDay} /> in{' '}
          <strong>{ascentsInMostAscentDay[0]?.crag}</strong>
        </p>
      )}
    </Card>
  )
}

function DaysOutsideDetails({
  ascents,
  ascentsRatio,
  daysOutside,
}: {
  ascents: Ascent[]
  ascentsRatio: string
  daysOutside: number
}) {
  return (
    <p>
      You climbed <AscentsWithPopover ascents={ascents} /> in{' '}
      <strong>{daysOutside}</strong> days (<strong>{ascentsRatio}</strong>{' '}
      ascents per day outside)
    </p>
  )
}
