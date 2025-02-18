import {
  fromSessionTypeToBackgroundColor,
  fromSessionTypeToClassName,
} from '~/helpers/converter'
import { fromSessionTypeToSortOrder } from '~/helpers/sorter'
import { createTrainingBarCodeTooltip } from '~/helpers/tooltips'
import type { TrainingSession } from '~/schema/training'
import type { StringDateTime } from '~/types/generic'

import styles from './barcode.module.css'

type TrainingBarsProps = {
  weeklyTraining: ((StringDateTime & TrainingSession) | undefined)[]
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

  return (
    <span
      className={`${
        isSingleWeekTraining
          ? fromSessionTypeToClassName(weeklyTraining[0]?.sessionType)
          : ''
      } ${styles.bar}`}
      style={{
        inlineSize: `${numberOfTraining / 2}%`,
        background: isSingleWeekTraining
          ? undefined
          : `linear-gradient(to bottom in oklch, ${filteredWeeklyTraining
              .map(({ sessionType }) =>
                fromSessionTypeToBackgroundColor(sessionType),
              )
              .join(', ')})`,
      }}
      title={createTrainingBarCodeTooltip(filteredWeeklyTraining)}
    />
  )
}
