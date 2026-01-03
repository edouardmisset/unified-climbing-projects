import { INDOOR_SESSION_TYPES } from '~/constants/training'
import { roundToTen } from '~/helpers/math'
import type { TrainingSession } from '~/schema/training'

export function calculatePercentage({
  firstLabel,
  firstSessions,
  secondLabel,
  secondSessions,
}: CalculateRatioInput): CalculateRatioOutput {
  const firstCount = firstSessions.length
  const secondCount = secondSessions.length
  const percentage =
    firstCount === 0 || secondCount === 0
      ? 'N/A'
      : roundToTen((firstCount / (secondCount + firstCount)) * 100).toString()

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

type CalculateRatioInput = {
  firstLabel: string
  firstSessions: TrainingSession[]
  secondLabel: string
  secondSessions: TrainingSession[]
}

export type CalculateRatioOutput = {
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
    const isIndoor =
      sessionType !== undefined && INDOOR_SESSION_TYPES.includes(sessionType)
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
