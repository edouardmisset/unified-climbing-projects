import { INDOOR_SESSION_TYPES } from '~/constants/training'
import { roundToTen } from '~/helpers/math'
import type { TrainingSession } from '~/schema/training'

/**
 * Calculate the percentage of first sessions relative to total sessions.
 * Returns 'N/A' if there are no sessions to avoid division by zero.
 */
export function calculateSessionPercentage(
  firstCount: number,
  secondCount: number,
): string {
  const total = firstCount + secondCount
  if (total === 0) return 'N/A'

  return roundToTen((firstCount / total) * 100).toString()
}

/**
 * Get categorized session counts and labels for display.
 * This is primarily a data structure for passing to UI components.
 */
export function getSessionRatioData({
  firstLabel,
  firstSessions,
  secondLabel,
  secondSessions,
}: SessionRatioInput): SessionRatioData {
  const firstCount = firstSessions.length
  const secondCount = secondSessions.length
  const percentage = calculateSessionPercentage(firstCount, secondCount)

  return {
    percentage,
    firstLabel,
    firstCount,
    firstSessions,
    secondLabel,
    secondCount,
    secondSessions,
  }
}

type SessionRatioInput = {
  firstLabel: string
  firstSessions: TrainingSession[]
  secondLabel: string
  secondSessions: TrainingSession[]
}

export type SessionRatioData = {
  percentage: string
  firstLabel: string
  firstCount: number
  firstSessions: TrainingSession[]
  secondLabel: string
  secondCount: number
  secondSessions: TrainingSession[]
}

export function categorizeSessions(
  sessions: TrainingSession[],
): CategorizedSessionsOutput {
  const indoor: TrainingSession[] = []
  const outdoor: TrainingSession[] = []
  const indoorRoute: TrainingSession[] = []
  const indoorBoulder: TrainingSession[] = []
  const outdoorRoute: TrainingSession[] = []
  const outdoorBoulder: TrainingSession[] = []

  for (const session of sessions) {
    const { sessionType, climbingDiscipline } = session
    const isIndoor = isIndoorSession({ sessionType })
    const isOutdoor = sessionType === 'Out'

    if (isIndoor) {
      indoor.push(session)
      if (climbingDiscipline === 'Route') indoorRoute.push(session)
      if (climbingDiscipline === 'Boulder') indoorBoulder.push(session)
    } else if (isOutdoor) {
      outdoor.push(session)
      if (climbingDiscipline === 'Route') outdoorRoute.push(session)
      if (climbingDiscipline === 'Boulder') outdoorBoulder.push(session)
    }
  }

  return {
    indoor,
    outdoor,
    indoorRoute,
    indoorBoulder,
    outdoorRoute,
    outdoorBoulder,
  }
}

type CategorizedSessionsOutput = {
  indoor: TrainingSession[]
  outdoor: TrainingSession[]
  indoorRoute: TrainingSession[]
  indoorBoulder: TrainingSession[]
  outdoorRoute: TrainingSession[]
  outdoorBoulder: TrainingSession[]
}

export function isIndoorSession({
  sessionType,
}: {
  sessionType?: TrainingSession['sessionType']
}): boolean {
  return sessionType !== undefined && INDOOR_SESSION_TYPES.includes(sessionType)
}
