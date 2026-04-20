import { lazy, memo, Suspense, useMemo } from 'react'
import { getWeekNumber } from '~/helpers/date'
import { formatCountWithEnglishNoun } from '~/helpers/format-plurals'
import { formatNumber } from '~/helpers/number-formatter'
import { fromSessionTypeToSortOrder } from '~/helpers/sorter'
import {
  fromSessionTypeToBackgroundColor,
  fromSessionTypeToClassName,
} from '~/helpers/training-converter'
import type { TrainingSession } from '~/schema/training'
import type { StringDate } from '~/types/generic'
import { Popover } from '../ui/popover/popover'
import styles from './barcode.module.css'

// Lazy load the popover component
const TrainingPopoverDescription = lazy(async () =>
  import('../training-popover-description/training-popover-description').then(module => ({
    default: module.TrainingPopoverDescription,
  })),
)

export const TrainingBar = memo(({ weeklyTraining }: TrainingBarsProps) => {
  const numberOfTraining = weeklyTraining.length
  const isSingleWeekTraining = numberOfTraining <= 1

  const filteredSortedWeeklyTraining = useMemo(
    () =>
      weeklyTraining
        .filter(Boolean)
        .sort(({ sessionType: aType }, { sessionType: bType }) =>
          aType === undefined || bType === undefined
            ? 0
            : fromSessionTypeToSortOrder(bType) - fromSessionTypeToSortOrder(aType),
        ),
    [weeklyTraining],
  )

  const [firstTraining] = filteredSortedWeeklyTraining

  const buttonStyle = useMemo(
    () => ({
      background: isSingleWeekTraining
        ? undefined
        : `linear-gradient(to bottom in oklch, ${filteredSortedWeeklyTraining
            .map(({ sessionType }) => fromSessionTypeToBackgroundColor(sessionType))
            .join(', ')})`,
      inlineSize: `${numberOfTraining / 2}%`,
    }),
    [filteredSortedWeeklyTraining, numberOfTraining, isSingleWeekTraining],
  )

  // LAZY LOADING: Create description component only when needed
  const lazyDescription = useMemo(() => {
    if (filteredSortedWeeklyTraining.length === 0) return ''
    return (
      <Suspense fallback='Loading...'>
        <TrainingPopoverDescription trainingSessions={filteredSortedWeeklyTraining} />
      </Suspense>
    )
  }, [filteredSortedWeeklyTraining])

  if (firstTraining === undefined) return <span />

  const trainingBarClassName = `${
    isSingleWeekTraining ? fromSessionTypeToClassName(firstTraining?.sessionType) : ''
  } ${styles.bar}`

  return (
    <Popover
      className={trainingBarClassName}
      popoverTitle={getTrainingSessionSummary(filteredSortedWeeklyTraining)}
      style={buttonStyle}
      trigger=''
    >
      {lazyDescription}
    </Popover>
  )
})

function getTrainingSessionSummary(trainingSessionInWeek: TrainingSession[]) {
  const [firstSession] = trainingSessionInWeek
  return firstSession === undefined
    ? ''
    : `${formatCountWithEnglishNoun(trainingSessionInWeek.length, {
        one: 'training session',
        other: 'training sessions',
      })} in week # ${formatNumber(getWeekNumber(new Date(firstSession.date)), {
        useGrouping: false,
      })}`
}

type TrainingBarsProps = {
  weeklyTraining: ((StringDate & TrainingSession) | undefined)[]
}
