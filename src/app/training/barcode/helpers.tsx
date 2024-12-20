import { maxBarWidth } from '~/app/_components/barcode/barcode'
import { fromSessionTypeToBackgroundColor } from '~/helpers/converter'
import { fromSessionTypeToSortOrder } from '~/helpers/sorter'
import { createTrainingBarCodeTooltip } from '~/helpers/tooltips'
import type { TrainingSession } from '~/schema/training'
import type { StringDateTime } from '~/types/generic'

export function trainingSessionsBarcodeRender(
  weeklyTraining: ((StringDateTime & TrainingSession) | undefined)[],
  index: number,
) {
  const barWidth = weeklyTraining.length

  // Sort week's training by ascending grades
  const filteredWeeklyTraining = weeklyTraining
    .filter(training => training !== undefined)
    .sort(({ sessionType: aType }, { sessionType: bType }) =>
      aType === undefined || bType === undefined
        ? 0
        : fromSessionTypeToSortOrder(bType) - fromSessionTypeToSortOrder(aType),
    )

  // Colorize bars
  const backgroundGradient =
    weeklyTraining.length === 1
      ? fromSessionTypeToBackgroundColor(
          weeklyTraining[0]?.sessionType,
        ).toString()
      : `linear-gradient(${filteredWeeklyTraining
          .map(({ sessionType }) =>
            fromSessionTypeToBackgroundColor(sessionType),
          )
          .join(', ')})`

  return (
    <span
      key={(filteredWeeklyTraining[0]?.date ?? index).toString()}
      style={{
        display: 'block',
        blockSize: '100%',
        width: barWidth,
        maxWidth: maxBarWidth,
        background: backgroundGradient,
      }}
      title={createTrainingBarCodeTooltip(filteredWeeklyTraining)}
    />
  )
}
