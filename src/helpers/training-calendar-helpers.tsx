import type { DayDescriptor } from '~/app/_components/year-grid/year-grid'
import { getSessionColor } from '~/helpers/training-converter'
import type { TrainingSession } from '~/schema/training'
import { prettyLongDate } from './formatters'

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
          title: '',
        }
      }

      const { date, type, intensity, volume } = firstSession
      const backgroundColor = getSessionColor({
        intensityPercent: intensity,
        sessionType: type,
        volumePercent: volume,
      })

      return {
        backgroundColor,
        date,
        shortText: type ?? '',
        title: prettyLongDate(date),
        trainingSessions: sessions,
      }
    }) ?? []
  )
}
