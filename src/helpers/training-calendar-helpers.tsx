import type { DayDescriptor } from '~/app/_components/year-grid/year-grid'
import { getSessionTypeColors } from '~/helpers/training-converter'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { prettyLongDate } from './formatters'
import { NOON_HOUR } from '~/constants/generic'

export function fromTrainingSessionsToCalendarEntries(
  year: number,
  trainingSessionsArray?: TrainingSession[][],
  allAscents: Ascent[] = [],
): DayDescriptor[] {
  const ascentsByDate = new Map<string, Ascent[]>()
  for (const ascent of allAscents) {
    const dateKey = ascent.date.slice(0, 10)
    const existing = ascentsByDate.get(dateKey)
    if (existing) {
      existing.push(ascent)
    } else {
      ascentsByDate.set(dateKey, [ascent])
    }
  }

  return (
    trainingSessionsArray?.map((sessions, index): DayDescriptor => {
      const [firstSession] = sessions

      if (firstSession === undefined)
        return {
          date: new Date(year, 0, index + 1, NOON_HOUR).toISOString(),
          shortText: '',
          title: '',
        }

      const { date, sessionType, intensity, volume } = firstSession
      const backgroundColor = getSessionTypeColors({
        intensityPercent: intensity,
        sessionType,
        volumePercent: volume,
      })

      const isOutdoorSession = sessions.some(session => session.sessionType === 'Out')
      const matchingAscents = isOutdoorSession ? (ascentsByDate.get(date.slice(0, 10)) ?? []) : []

      return {
        backgroundColor,
        date,
        shortText: sessionType ?? '',
        title: prettyLongDate(date),
        trainingSessions: sessions,
        ...(matchingAscents.length > 0 && { ascents: matchingAscents }),
      }
    }) ?? []
  )
}
