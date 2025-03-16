import { memo, useMemo } from 'react'
import {
  fromSessionTypeToBackgroundColor,
  fromSessionTypeToClassName,
} from '~/helpers/converter'
import { getWeekNumber } from '~/helpers/date'
import { fromSessionTypeToSortOrder } from '~/helpers/sorter'
import { TrainingInWeekDescription } from '~/helpers/tooltips'
import type { TrainingSession } from '~/schema/training'
import type { StringDate } from '~/types/generic'
import { Popover } from '../popover/popover'
import styles from './barcode.module.css'

type TrainingBarsProps = {
  weeklyTraining: ((StringDate & TrainingSession) | undefined)[]
}

export const TrainingBar = memo(({ weeklyTraining }: TrainingBarsProps) => {
  const numberOfTraining = weeklyTraining.length

  // Sort week's training by session type
  const filteredWeeklyTraining = weeklyTraining
    .filter(training => training !== undefined)
    .sort(({ sessionType: aType }, { sessionType: bType }) =>
      aType === undefined || bType === undefined
        ? 0
        : fromSessionTypeToSortOrder(bType) - fromSessionTypeToSortOrder(aType),
    )

  const isSingleWeekTraining = weeklyTraining.length <= 1

  if (filteredWeeklyTraining[0] === undefined) return <span />
  const buttonStyle = useMemo(
    () => ({
      inlineSize: `${numberOfTraining / 2}%`,
      background: isSingleWeekTraining
        ? undefined
        : `linear-gradient(to bottom in oklch, ${filteredWeeklyTraining
            .map(({ sessionType }) =>
              fromSessionTypeToBackgroundColor(sessionType),
            )
            .join(', ')})`,
    }),
    [filteredWeeklyTraining, numberOfTraining, isSingleWeekTraining],
  )
  const trainingBarClassName = useMemo(
    () =>
      `${
        isSingleWeekTraining
          ? fromSessionTypeToClassName(weeklyTraining[0]?.sessionType)
          : ''
      } ${styles.bar}`,
    [weeklyTraining, isSingleWeekTraining],
  )
  const weeklyTrainingSummary = useMemo(
    () => getTrainingSessionSummary(filteredWeeklyTraining),
    [filteredWeeklyTraining],
  )
  return (
    <Popover
      triggerClassName={trainingBarClassName}
      buttonStyle={buttonStyle}
      triggerContent=""
      popoverDescription={
        <TrainingInWeekDescription sessions={filteredWeeklyTraining} />
      }
      popoverTitle={weeklyTrainingSummary}
    />
  )
})

function getTrainingSessionSummary(trainingSessionInWeek: TrainingSession[]) {
  return trainingSessionInWeek[0] === undefined
    ? ''
    : `${trainingSessionInWeek.length} training sessions in week # ${getWeekNumber(new Date(trainingSessionInWeek[0].date))}`
}
