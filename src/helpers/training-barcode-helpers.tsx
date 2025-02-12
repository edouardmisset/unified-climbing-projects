import {
  fromSessionTypeToBackgroundColor,
  fromSessionTypeToClassName,
} from '~/helpers/converter'
import { fromSessionTypeToSortOrder } from '~/helpers/sorter'
import { createTrainingBarCodeTooltip } from '~/helpers/tooltips'
import type { TrainingSession } from '~/schema/training'
import type { StringDate } from '~/types/generic'

import styles from '~/app/_components/barcode/barcode.module.css'

export function trainingSessionsBarcodeRender(
  weeklyTraining: ((StringDate & TrainingSession) | undefined)[],
) {
  const numberOfTraining = weeklyTraining.length

  // Sort week's training by session type
  const filteredWeeklyTraining = weeklyTraining
    .filter(training => training !== undefined)
    .sort(({ sessionType: aType }, { sessionType: bType }) =>
      aType === undefined || bType === undefined
        ? 0
        : fromSessionTypeToSortOrder(bType) - fromSessionTypeToSortOrder(aType),
    )

  if (filteredWeeklyTraining[0] === undefined) return <span />

  const isSingleWeekTraining = weeklyTraining.length <= 1

  return (
    <span
      key={filteredWeeklyTraining[0].date}
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
