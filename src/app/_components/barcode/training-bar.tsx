import {
  fromSessionTypeToBackgroundColor,
  fromSessionTypeToClassName,
} from '~/helpers/converter'
import { getWeekNumber } from '~/helpers/date'
import { fromSessionTypeToSortOrder } from '~/helpers/sorter'
import { TrainingInWeekDescription } from '~/helpers/tooltips'
import type { TrainingSession } from '~/schema/training'
import type { StringDate } from '~/types/generic'
import Popover from '../popover/popover'
import styles from './barcode.module.css'

type TrainingBarsProps = {
  weeklyTraining: ((StringDate & TrainingSession) | undefined)[]
}

export function TrainingBar({ weeklyTraining }: TrainingBarsProps) {
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
  return (
    <Popover
      triggerClassName={`${
        isSingleWeekTraining
          ? fromSessionTypeToClassName(weeklyTraining[0]?.sessionType)
          : ''
      } ${styles.bar}`}
      buttonStyle={{
        inlineSize: `${numberOfTraining / 2}%`,
        background: isSingleWeekTraining
          ? undefined
          : `linear-gradient(to bottom in oklch, ${filteredWeeklyTraining
              .map(({ sessionType }) =>
                fromSessionTypeToBackgroundColor(sessionType),
              )
              .join(', ')})`,
      }}
      triggerContent=""
      popoverDescription={
        <TrainingInWeekDescription sessions={filteredWeeklyTraining} />
      }
      popoverTitle={`${filteredWeeklyTraining.length} training sessions in week # ${getWeekNumber(new Date(filteredWeeklyTraining[0].date))}`}
    />
  )
}
