import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import type { TrainingSession } from '~/schema/training'

type Discipline = NonNullable<TrainingSession['climbingDiscipline']>

type SessionsPerDiscipline = {
  id: Discipline
  label: Discipline
  value: number
  color: string
}[]

export function getSessionsPerDiscipline(sessions: TrainingSession[]): SessionsPerDiscipline {
  if (sessions.length === 0) return []

  const sessionsWithDiscipline = sessions.filter(
    session => session.climbingDiscipline !== undefined,
  )

  const disciplineCounts = new Map<Discipline, number>()

  for (const { climbingDiscipline } of sessionsWithDiscipline) {
    if (!climbingDiscipline) continue
    disciplineCounts.set(climbingDiscipline, (disciplineCounts.get(climbingDiscipline) ?? 0) + 1)
  }

  return Array.from(disciplineCounts.entries())
    .map(([discipline, count]) => ({
      color: CLIMBING_DISCIPLINE_TO_COLOR[discipline] ?? 'var(--gray-5)',
      id: discipline,
      label: discipline,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
}
