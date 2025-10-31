import { lazy, memo, Suspense, useMemo } from 'react'
import { getWeekNumber } from '~/helpers/date'
import { SESSION_TYPE, type TrainingSession } from '~/schema/training'
import type { StringDate } from '~/types/generic'
import { Popover } from '../popover/popover'
import styles from './barcode.module.css'

// Lazy load the popover component
const TrainingPopoverDescription = lazy(() =>
  import('../training-popover-description/training-popover-description').then(
    module => ({ default: module.TrainingPopoverDescription }),
  ),
)

export const TrainingBar = memo(({ weeklyTraining }: TrainingBarsProps) => {
  const numberOfTraining = weeklyTraining.length
  const isSingleWeekTraining = numberOfTraining <= 1

  const filteredSortedWeeklyTraining = useMemo(
    () =>
      weeklyTraining
        .filter(Boolean)
        .sort(({ type: aType }, { type: bType }) =>
          aType === undefined || bType === undefined
            ? 0
            : SESSION_TYPE[bType].order - SESSION_TYPE[aType].order,
        ),
    [weeklyTraining],
  )

  const [firstTraining] = filteredSortedWeeklyTraining

  const buttonStyle = useMemo(
    () => ({
      background: isSingleWeekTraining
        ? undefined
        : `linear-gradient(to bottom in oklch, ${filteredSortedWeeklyTraining
            .map(({ type }) =>
              type ? SESSION_TYPE[type].color : 'var(--surface-1)',
            )
            .join(', ')})`,
      inlineSize: `${numberOfTraining / 2}%`,
    }),
    [filteredSortedWeeklyTraining, numberOfTraining, isSingleWeekTraining],
  )

  // LAZY LOADING: Create description component only when needed
  const lazyDescription = useMemo(() => {
    if (filteredSortedWeeklyTraining.length === 0) return ''
    return (
      <Suspense fallback="Loading...">
        <TrainingPopoverDescription
          trainingSessions={filteredSortedWeeklyTraining}
        />
      </Suspense>
    )
  }, [filteredSortedWeeklyTraining])

  if (firstTraining === undefined) return <span />

  const trainingBarClassName = `${
    isSingleWeekTraining && firstTraining?.type
      ? SESSION_TYPE[firstTraining.type].category
      : ''
  } ${styles.bar}`

  return (
    <Popover
      buttonStyle={buttonStyle}
      popoverDescription={lazyDescription}
      popoverTitle={getTrainingSessionSummary(filteredSortedWeeklyTraining)}
      triggerClassName={trainingBarClassName}
      triggerContent=""
    />
  )
})

function getTrainingSessionSummary(trainingSessionInWeek: TrainingSession[]) {
  const [firstSession] = trainingSessionInWeek
  return firstSession === undefined
    ? ''
    : `${trainingSessionInWeek.length} training sessions in week # ${getWeekNumber(new Date(firstSession.date))}`
}

type TrainingBarsProps = {
  weeklyTraining: ((StringDate & TrainingSession) | undefined)[]
}
