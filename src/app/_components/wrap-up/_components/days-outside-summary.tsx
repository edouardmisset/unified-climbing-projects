import humanizeDuration from 'humanize-duration'
import { Suspense } from 'react'
import { calculateAscentsPerDay } from '~/helpers/calculate-ascents-per-day'
import {
  extractDateFromISODateString,
  findLongestGap,
  findLongestStreak,
  getMostFrequentDate,
} from '~/helpers/date'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { formatLongDate } from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'
import { Card } from '../../card/card'

const MIN_GAP_THRESHOLD = 5 // days, below this threshold, we don't count as a gap

export async function DaysOutsideSummary({
  ascents,
  trainingSessions,
}: {
  ascents: Ascent[]
  trainingSessions: TrainingSession[]
}) {
  const outdoorSessions = filterTrainingSessions(trainingSessions, {
    sessionType: 'Out',
  })

  const consecutiveClimbingDays = findLongestStreak(outdoorSessions)
  const longestGap = findLongestGap(outdoorSessions)

  if (ascents.length === 0 || outdoorSessions.length === 0) return undefined

  const [mostAscentDate] = getMostFrequentDate(ascents)

  const mostAscentDay = extractDateFromISODateString(mostAscentDate)

  const ascentsInMostAscentDay = ascents.filter(({ date }) => {
    try {
      return extractDateFromISODateString(date) === mostAscentDay
    } catch (error) {
      globalThis.console.error(`Failed to parse date '${date}':`, error)
      return false
    }
  })

  const ascentsRatio = calculateAscentsPerDay(
    ascents,
    trainingSessions,
  ).toFixed(1)

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
            daysOutside={outdoorSessions.length}
          />
        </Suspense>
        {mostAscentDate === '' ||
        ascentsInMostAscentDay[0] === undefined ? undefined : (
          <span className="block">
            Your best day was <strong>{formatLongDate(mostAscentDate)}</strong>{' '}
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
