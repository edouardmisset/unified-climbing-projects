import type { DayDescriptor } from '~/app/_components/year-grid/year-grid'
import { getSessionTypeColors } from '~/helpers/converter'
import { TrainingDayPopoverDescription } from '~/helpers/tooltips'
import type { TrainingSession } from '~/schema/training'
import { formatDateInTooltip } from './formatters'

export function fromTrainingSessionsToCalendarEntries(
  year: number,
  trainingSessionsArray?: TrainingSession[][],
): DayDescriptor[] {
  return (
    trainingSessionsArray?.map((sessions, index): DayDescriptor => {
      const firstSession = sessions[0]

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
        description: (
          <TrainingDayPopoverDescription trainingSession={firstSession} />
        ),
        shortText: sessionType ?? '',
      }
    }) ?? []
  )
}
