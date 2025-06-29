import humanizeDuration from 'humanize-duration'
import { Suspense } from 'react'
import {
  findLongestGap,
  findLongestStreak,
  getMostFrequentDate,
} from '~/helpers/date'
import { formatDateTime } from '~/helpers/format-date'
import type { Ascent } from '~/schema/ascent'
import { api } from '~/trpc/server'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'
import { Card } from '../../card/card'

const MIN_GAP_THRESHOLD = 5

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

  const consecutiveClimbingDays = findLongestStreak(outdoorSessions)
  const longestGap = findLongestGap(outdoorSessions)
  console.log('🚀 ~ longestGap:', longestGap)

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
      <p>
        <Suspense
          fallback={
            <p>
              <strong>Loading details...</strong>
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
        ascentsInMostAscentDay[0] === undefined ? undefined : (
          <span className="block">
            Your best day was{' '}
            <strong>
              {formatDateTime(new Date(mostAscentDate), 'longDate')}
            </strong>{' '}
            where you climbed{' '}
            <AscentsWithPopover ascents={ascentsInMostAscentDay} /> in{' '}
            <strong>{ascentsInMostAscentDay[0].crag}</strong>
          </span>
        )}
        {consecutiveClimbingDays === 0 ? undefined : (
          <span className="block">
            Your longest streak was <strong>{consecutiveClimbingDays}</strong>{' '}
            days.
          </span>
        )}
        {longestGap >= MIN_GAP_THRESHOLD ? (
          <span className="block">
            Your longest gap without climbing was{' '}
            <strong>
              {humanizeDuration(longestGap * 24 * 60 * 60 * 1000, {
                units: ['mo', 'w', 'd'],
                largest: 2,
                conjunction: ' and ',
                round: true,
              })}
            </strong>
            .
          </span>
        ) : undefined}
      </p>
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
    <span className="block">
      You climbed <AscentsWithPopover ascents={ascents} /> in{' '}
      <strong>{daysOutside}</strong> days (<strong>{ascentsRatio}</strong>{' '}
      ascents per day outside)
    </span>
  )
}
