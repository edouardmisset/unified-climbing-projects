import { maxBarWidth } from '~/app/_components/barcode/barcode'
import { convertSessionTypeToBackgroundColor } from '~/helpers/converter'
import { convertSessionTypeToSortOrder } from '~/helpers/sorter'
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
    .sort(({ sessionType: aType }, { sessionType: bType }) => {
      if (aType === undefined || bType === undefined) return 0

      return (
        convertSessionTypeToSortOrder(bType) -
        convertSessionTypeToSortOrder(aType)
      )
    })

  // Colorize bars
  const backgroundGradient =
    weeklyTraining.length === 1
      ? convertSessionTypeToBackgroundColor(
          weeklyTraining[0]?.sessionType,
        ).toString()
      : `linear-gradient(${filteredWeeklyTraining
          .map(training =>
            convertSessionTypeToBackgroundColor(training?.sessionType),
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
