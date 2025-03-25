import { TrainingPopoverDescription } from '~/app/_components/training-popover-description/training-popover-description'
import type { DayDescriptor } from '~/app/_components/year-grid/year-grid'
import { getSessionTypeColors } from '~/helpers/converter'
import type { TrainingSession } from '~/schema/training'
import { formatDateInTooltip } from './formatters'

export function fromTrainingSessionsToCalendarEntries(
  year: number,
  trainingSessionsArray?: TrainingSession[][],
): DayDescriptor[] {
  return (
    trainingSessionsArray?.map((sessions, index): DayDescriptor => {
      const [firstSession] = sessions

      if (firstSession === undefined) {
        return {
          date: new Date(year, 0, index + 1, 12).toISOString(),
          shortText: '',
          description: '',
          title: '',
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
        title: formatDateInTooltip(date),
        description: <TrainingPopoverDescription trainingSessions={sessions} />,
        shortText: sessionType ?? '',
      }
    }) ?? []
  )
}
