import { Suspense } from 'react'
import { calculateAscentsPerDay } from '~/helpers/calculate-ascents-per-day'
import {
  extractDateFromISODateString,
  findLongestGap,
  findLongestStreak,
  getMostFrequentDate,
} from '~/helpers/date'
import { formatFrenchDurationFromDays } from '~/helpers/format-duration'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { formatCountWithEnglishNoun } from '~/helpers/format-plurals'
import { formatLongDate } from '~/helpers/formatters'
import { formatNumber } from '~/helpers/number-formatter'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'
import { Card } from '../../ui/card/card'
import { DaysOutsideDetails } from './days-outside-details'

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

  if (ascents.length === 0 || outdoorSessions.length === 0) return

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

  const ascentsRatio = formatNumber(calculateAscentsPerDay(ascents, trainingSessions), {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })

  const isBelowMinGapThreshold = MIN_GAP_THRESHOLD < longestGap
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
        {mostAscentDate === '' || ascentsInMostAscentDay[0] === undefined ? undefined : (
          <span className='block'>
            Your best day was <strong>{formatLongDate(mostAscentDate)}</strong> where you climbed{' '}
            <AscentsWithPopover ascents={ascentsInMostAscentDay} /> in{' '}
            <strong>{ascentsInMostAscentDay[0].crag}</strong>
          </span>
        )}
        {consecutiveClimbingDays === 0 ? undefined : (
          <span className='block'>
            Your longest streak was{' '}
            <strong>
              {formatCountWithEnglishNoun(consecutiveClimbingDays, {
                one: 'day',
                other: 'days',
              })}
            </strong>
            .
          </span>
        )}
        {isBelowMinGapThreshold ? undefined : (
          <span className='block'>
            Your longest gap without climbing was{' '}
            <strong>{formatFrenchDurationFromDays(longestGap)}</strong>.
          </span>
        )}
      </p>
    </Card>
  )
}
