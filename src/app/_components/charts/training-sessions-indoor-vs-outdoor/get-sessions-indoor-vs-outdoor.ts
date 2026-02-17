import type { TrainingSession } from '~/schema/training'
import type { LocationType } from '../../filter-bar/types'
import { isIndoorSession } from '../../wrap-up/_components/training-summary/helpers'

type SessionsIndoorVsOutdoor = {
  id: LocationType
  label: LocationType
  value: number
  color: string
}[]

export function getSessionsIndoorVsOutdoor(sessions: TrainingSession[]): SessionsIndoorVsOutdoor {
  if (sessions.length === 0) return []

  let indoorCount = 0
  let outdoorCount = 0

  for (const session of sessions) {
    const { sessionType } = session
    if (sessionType === 'Out') {
      outdoorCount++
    } else if (isIndoorSession({ sessionType })) {
      indoorCount++
    }
  }

  const result: SessionsIndoorVsOutdoor = []

  if (indoorCount > 0) {
    result.push({
      color: 'var(--indoor)',
      id: 'Indoor',
      label: 'Indoor',
      value: indoorCount,
    })
  }

  if (outdoorCount > 0) {
    result.push({
      color: 'var(--outdoor)',
      id: 'Outdoor',
      label: 'Outdoor',
      value: outdoorCount,
    })
  }

  return result
}
