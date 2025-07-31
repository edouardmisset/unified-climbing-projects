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
            : fromSessionTypeToSortOrder(bType) -
              fromSessionTypeToSortOrder(aType),
        ),
    [weeklyTraining],
  )

  const [firstTraining] = filteredSortedWeeklyTraining

  const buttonStyle = useMemo(
    () => ({
      background: isSingleWeekTraining
        ? undefined
        : `linear-gradient(to bottom in oklch, ${filteredSortedWeeklyTraining
            .map(({ sessionType }) =>
              fromSessionTypeToBackgroundColor(sessionType),
            )
            .join(', ')})`,
      inlineSize: `${numberOfTraining / 2}%`,
    }),
    [filteredSortedWeeklyTraining, numberOfTraining, isSingleWeekTraining],
  )

  if (firstTraining === undefined) return <span />

  const trainingBarClassName = `${
    isSingleWeekTraining
      ? fromSessionTypeToClassName(firstTraining?.sessionType)
      : ''
  } ${styles.bar}`

  return (
    <Popover
      buttonStyle={buttonStyle}
      popoverDescription={
        <TrainingPopoverDescription
          trainingSessions={filteredSortedWeeklyTraining}
        />
      }
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
