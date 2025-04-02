import { memo, useMemo } from 'react'
import { getWeekNumber } from '~/helpers/date'
import { fromSessionTypeToSortOrder } from '~/helpers/sorter'
import {
  fromSessionTypeToBackgroundColor,
  fromSessionTypeToClassName,
} from '~/helpers/training-converter'
import type { TrainingSession } from '~/schema/training'
import type { StringDate } from '~/types/generic'
import { Popover } from '../popover/popover'
import { TrainingPopoverDescription } from '../training-popover-description/training-popover-description'
import styles from './barcode.module.css'

type TrainingBarsProps = {
  weeklyTraining: ((StringDate & TrainingSession) | undefined)[]
}

export const TrainingBar = memo(({ weeklyTraining }: TrainingBarsProps) => {
  const numberOfTraining = weeklyTraining.length

  // Sort week's training by session type
  const filteredSortedWeeklyTraining = useMemo(
    () =>
      weeklyTraining
        .filter(training => training !== undefined)
        .sort(({ sessionType: aType }, { sessionType: bType }) =>
          aType === undefined || bType === undefined
            ? 0
            : fromSessionTypeToSortOrder(bType) -
              fromSessionTypeToSortOrder(aType),
        ),
    [weeklyTraining],
  )

  const isSingleWeekTraining = weeklyTraining.length <= 1

  const [firstTraining] = filteredSortedWeeklyTraining

  if (firstTraining === undefined) return <span />

  const buttonStyle = useMemo(
    () => ({
      inlineSize: `${numberOfTraining / 2}%`,
      background: isSingleWeekTraining
        ? undefined
        : `linear-gradient(to bottom in oklch, ${filteredSortedWeeklyTraining
            .map(({ sessionType }) =>
              fromSessionTypeToBackgroundColor(sessionType),
            )
            .join(', ')})`,
    }),
    [filteredSortedWeeklyTraining, numberOfTraining, isSingleWeekTraining],
  )
  const trainingBarClassName = useMemo(
    () =>
      `${
        isSingleWeekTraining
          ? fromSessionTypeToClassName(firstTraining?.sessionType)
          : ''
      } ${styles.bar}`,
    [firstTraining, isSingleWeekTraining],
  )
  const weeklyTrainingSummary = useMemo(
    () => getTrainingSessionSummary(filteredSortedWeeklyTraining),
    [filteredSortedWeeklyTraining],
  )
  return (
    <Popover
      triggerClassName={trainingBarClassName}
      buttonStyle={buttonStyle}
      triggerContent=""
      popoverDescription={
        <TrainingPopoverDescription
          trainingSessions={filteredSortedWeeklyTraining}
        />
      }
      popoverTitle={weeklyTrainingSummary}
    />
  )
})

function getTrainingSessionSummary(trainingSessionInWeek: TrainingSession[]) {
  const [firstSession] = trainingSessionInWeek
  return firstSession === undefined
    ? ''
    : `${trainingSessionInWeek.length} training sessions in week # ${getWeekNumber(new Date(firstSession.date))}`
}
