import type { DayDescriptor } from '~/app/_components/year-grid/year-grid'
import { getSessionTypeColors } from '~/helpers/converter'
import { createTrainingQRTooltip } from '~/helpers/tooltips'
import type { TrainingSession } from '~/schema/training'
import type { StringDate } from '~/types/generic'

export function fromTrainingSessionsToCalendarEntries(
  trainingSessions?: (StringDate & TrainingSession)[],
): DayDescriptor[] {
  return (
    trainingSessions?.map(data => {
      const { date, sessionType } = data
      const backgroundColor = getSessionTypeColors({
        sessionType,
        intensityPercent: data?.intensity,
        volumePercent: data?.volume,
      })

      return {
        date,
        backgroundColor,
        tooltip: createTrainingQRTooltip(data),
        shortText: sessionType ?? '',
      }
    }) ?? []
  )
}
