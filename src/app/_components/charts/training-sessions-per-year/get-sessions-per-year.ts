import { createYearList } from '~/data/helpers'
import type { TrainingSession } from '~/schema/training'
import { isIndoorSession } from '../../wrap-up/_components/training-summary/helpers'

type SessionsPerYear = {
  year: number
  indoorRoute: number
  indoorBoulder: number
  outdoorRoute: number
  outdoorBoulder: number
}

export function getSessionsPerYear(sessions: TrainingSession[]): SessionsPerYear[] {
  if (sessions.length === 0) return []

  const years = createYearList(sessions, {
    descending: false,
    continuous: true,
  })

  const sessionsPerYearMap = new Map<
    number,
    {
      indoorBoulder: number
      indoorRoute: number
      outdoorBoulder: number
      outdoorRoute: number
    }
  >()

  for (const session of sessions) {
    const sessionYear = new Date(session.date).getFullYear()

    let counts = sessionsPerYearMap.get(sessionYear)
    if (!counts) {
      counts = {
        indoorBoulder: 0,
        indoorRoute: 0,
        outdoorBoulder: 0,
        outdoorRoute: 0,
      }
      sessionsPerYearMap.set(sessionYear, counts)
    }

    const { type, discipline } = session
    const isIndoor = isIndoorSession({ type })
    const isOutdoor = type === 'Outdoor'

    if (isIndoor && discipline === 'Bouldering') counts.indoorBoulder++
    else if (isIndoor && discipline === 'Sport') counts.indoorRoute++
    else if (isOutdoor && discipline === 'Bouldering') counts.outdoorBoulder++
    else if (isOutdoor && discipline === 'Sport') counts.outdoorRoute++
  }

  const result: SessionsPerYear[] = []

  for (const year of years) {
    const counts = sessionsPerYearMap.get(year) ?? {
      indoorBoulder: 0,
      indoorRoute: 0,
      outdoorBoulder: 0,
      outdoorRoute: 0,
    }

    // Add single entry per year with all 4 categories
    result.push({
      year,
      indoorRoute: counts.indoorRoute,
      indoorBoulder: counts.indoorBoulder,
      outdoorRoute: counts.outdoorRoute,
      outdoorBoulder: counts.outdoorBoulder,
    })
  }

  return result
}
