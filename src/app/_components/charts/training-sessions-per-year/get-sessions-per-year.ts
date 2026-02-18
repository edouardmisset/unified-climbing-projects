import { createYearList } from '~/data/helpers'
import type { TrainingSession } from '~/schema/training'
import { isIndoorSession } from '../../wrap-up/_components/training-summary/helpers'

export type SessionsPerYear = {
  year: number
  indoorRoute: number
  indoorRouteColor: string
  indoorBoulder: number
  indoorBoulderColor: string
  outdoorRoute: number
  outdoorRouteColor: string
  outdoorBoulder: number
  outdoorBoulderColor: string
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

    const { sessionType, climbingDiscipline } = session
    const isIndoor = isIndoorSession({ sessionType })
    const isOutdoor = sessionType === 'Out'

    if (isIndoor && climbingDiscipline === 'Boulder') {
      counts.indoorBoulder++
    } else if (isIndoor && climbingDiscipline === 'Route') {
      counts.indoorRoute++
    } else if (isOutdoor && climbingDiscipline === 'Boulder') {
      counts.outdoorBoulder++
    } else if (isOutdoor && climbingDiscipline === 'Route') {
      counts.outdoorRoute++
    }
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
      indoorRouteColor: 'var(--indoorRoute)',
      indoorBoulder: counts.indoorBoulder,
      indoorBoulderColor: 'var(--indoorBoulder)',
      outdoorRoute: counts.outdoorRoute,
      outdoorRouteColor: 'var(--route)',
      outdoorBoulder: counts.outdoorBoulder,
      outdoorBoulderColor: 'var(--boulder)',
    })
  }

  return result
}
