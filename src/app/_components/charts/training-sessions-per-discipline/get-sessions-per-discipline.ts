import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import type { TrainingSession } from '~/schema/training'

type SessionsPerDiscipline = {
  id: NonNullable<TrainingSession['climbingDiscipline']>
  label: NonNullable<TrainingSession['climbingDiscipline']>
  value: number
  color: string
}[]

export function getSessionsPerDiscipline(
  sessions: TrainingSession[],
): SessionsPerDiscipline {
  if (sessions.length === 0) return []

  const sessionsWithDiscipline = sessions.filter(
    session => session.climbingDiscipline !== undefined,
  )

  const disciplineCounts = sessionsWithDiscipline.reduce(
    (acc, { climbingDiscipline }) => {
      if (!climbingDiscipline) return acc
      acc[climbingDiscipline] = (acc[climbingDiscipline] ?? 0) + 1
      return acc
    },
    {} as Record<NonNullable<TrainingSession['climbingDiscipline']>, number>,
  )

  return Object.entries(disciplineCounts)
    .map(([discipline, count]) => ({
      color:
        CLIMBING_DISCIPLINE_TO_COLOR[
          discipline as keyof typeof CLIMBING_DISCIPLINE_TO_COLOR
        ] ?? 'var(--gray-5)',
      id: discipline as NonNullable<TrainingSession['climbingDiscipline']>,
      label: discipline as NonNullable<TrainingSession['climbingDiscipline']>,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
}
