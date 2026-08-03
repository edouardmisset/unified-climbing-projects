import { INDOOR_SESSION_TYPES } from '~/constants/training'
import { roundToTen } from '~/helpers/math'
import { formatWholePercent } from '~/helpers/number-formatter'
import type { TrainingSession } from '~/schema/training'

/**
 * Calculate the percentage of first sessions relative to total sessions.
 * Returns 'N/A' if there are no sessions to avoid division by zero.
 */
export function calculateSessionPercentage(firstCount: number, secondCount: number): string {
  const total = firstCount + secondCount
  if (total === 0) return 'N/A'

  return formatWholePercent(roundToTen((firstCount / total) * 100))
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

type SessionRatioData = {
  percentage: string
  firstLabel: string
  firstCount: number
  firstSessions: TrainingSession[]
  secondLabel: string
  secondCount: number
  secondSessions: TrainingSession[]
}

export function categorizeSessions(sessions: TrainingSession[]): CategorizedSessionsOutput {
  const categorized = createEmptyCategories()

  for (const session of sessions)
    if (isIndoorSession({ type: session.type })) addSession(categorized, session, 'indoor')
    else if (session.type === 'Outdoor') addSession(categorized, session, 'outdoor')

  return categorized
}

type CategorizedSessionsOutput = {
  indoor: TrainingSession[]
  outdoor: TrainingSession[]
  indoorRoute: TrainingSession[]
  indoorBoulder: TrainingSession[]
  outdoorRoute: TrainingSession[]
  outdoorBoulder: TrainingSession[]
}

function createEmptyCategories(): CategorizedSessionsOutput {
  return {
    indoor: [],
    outdoor: [],
    indoorRoute: [],
    indoorBoulder: [],
    outdoorRoute: [],
    outdoorBoulder: [],
  }
}

function addSession(
  categorized: CategorizedSessionsOutput,
  session: TrainingSession,
  location: 'indoor' | 'outdoor',
): void {
  categorized[location].push(session)
  if (session.discipline === 'Sport') categorized[`${location}Route`].push(session)
  if (session.discipline === 'Bouldering') categorized[`${location}Boulder`].push(session)
}

export function isIndoorSession({ type }: { type?: TrainingSession['type'] }): boolean {
  return type !== undefined && INDOOR_SESSION_TYPES.includes(type)
}
