import type { DayDescriptor } from '~/app/_components/year-grid/year-grid'
import { getSessionTypeColors } from '~/helpers/converter'
import { createTrainingQRTooltip } from '~/helpers/tooltips'
import type { TrainingSession } from '~/schema/training'

export function fromTrainingSessionsToCalendarEntries(
  year: number,
  trainingSessionsArray?: TrainingSession[][],
): DayDescriptor[] {
  return (
    trainingSessionsArray?.map((sessions, index) => {
      const firstSession = sessions[0]

      if (firstSession === undefined) {
        return {
          date: new Date(year, 0, index + 1, 12).toISOString(),
          shortText: '',
          tooltip: '',
        }
      }

      const { date, sessionType, intensity, volume } = firstSession
      const backgroundColor = getSessionTypeColors({
        sessionType,
        intensityPercent: intensity,
        volumePercent: volume,
      })

      return {
        date,
        backgroundColor,
        tooltip: createTrainingQRTooltip(firstSession),
        shortText: sessionType ?? '',
      }
    }) ?? []
  )
}
