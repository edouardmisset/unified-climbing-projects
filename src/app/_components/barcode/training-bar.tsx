import { lazy, Suspense } from 'react'
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

export function TrainingBar({ weeklyTraining }: TrainingBarsProps) {
  const numberOfTraining = weeklyTraining.length
  const isSingleWeekTraining = numberOfTraining <= 1

  const filteredSortedWeeklyTraining = weeklyTraining
    .filter(Boolean)
    .toSorted(
      ({ type: aType }, { type: bType }) =>
        fromSessionTypeToSortOrder(bType) - fromSessionTypeToSortOrder(aType),
    )

  const [firstTraining] = filteredSortedWeeklyTraining

  if (firstTraining === undefined) return <span />

  const buttonStyle = {
    background: isSingleWeekTraining
      ? undefined
      : `linear-gradient(to bottom in oklch, ${filteredSortedWeeklyTraining
          .map(({ type }) => fromSessionTypeToBackgroundColor(type))
          .join(', ')})`,
    inlineSize: `${numberOfTraining / 2}%`,
  }

  const lazyDescription = (
    <Suspense fallback='Loading...'>
      <TrainingPopoverDescription trainingSessions={filteredSortedWeeklyTraining} />
    </Suspense>
  )

  const trainingBarClassName = `${
    isSingleWeekTraining ? fromSessionTypeToClassName(firstTraining.type) : ''
  } ${styles.bar}`
  const title = getTrainingSessionSummary(filteredSortedWeeklyTraining)

  return (
    <Popover
      aria-label={title}
      className={trainingBarClassName}
      popoverTitle={title}
      showOnInterest
      style={buttonStyle}
      trigger=''
    >
      {lazyDescription}
    </Popover>
  )
}

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
