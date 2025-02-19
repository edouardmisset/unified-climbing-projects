import type { DayDescriptor } from '~/app/_components/year-grid/year-grid'
import { getSessionTypeColors } from '~/helpers/converter'
import { createTrainingQRTooltip } from '~/helpers/tooltips'
import type { TrainingSession } from '~/schema/training'

export function fromTrainingSessionsToCalendarEntries(
  trainingSessions?: TrainingSession[],
): DayDescriptor[] {
  return (
    trainingSessions?.map(session => {
      const { date, sessionType, intensity, volume } = session
      const backgroundColor = getSessionTypeColors({
        sessionType,
        intensityPercent: intensity,
        volumePercent: volume,
      })

      return {
        date,
        backgroundColor,
        tooltip: createTrainingQRTooltip(session),
        shortText: sessionType ?? '',
      }
    }) ?? []
  )
}
