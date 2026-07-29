import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import type { TrainingSession } from '~/schema/training'

type Discipline = NonNullable<TrainingSession['discipline']>

type SessionsPerDiscipline = {
  id: Discipline
  label: Discipline
  value: number
  fill: string
}[]

export function getSessionsPerDiscipline(sessions: TrainingSession[]): SessionsPerDiscipline {
  if (sessions.length === 0) return []

  const sessionsWithDiscipline = sessions.filter(session => session.discipline !== undefined)

  const disciplineCounts = new Map<Discipline, number>()

  for (const { discipline } of sessionsWithDiscipline) {
    if (!discipline) continue
    disciplineCounts.set(discipline, (disciplineCounts.get(discipline) ?? 0) + 1)
  }

  return [...disciplineCounts.entries()]
    .map(([discipline, count]) => ({
      fill: CLIMBING_DISCIPLINE_TO_COLOR[discipline] ?? 'var(--gray-5)',
      id: discipline,
      label: discipline,
      value: count,
    }))
    .toSorted((a, b) => b.value - a.value)
}
