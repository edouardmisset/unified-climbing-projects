import type { TrainingSessionListProps } from '~/schema/training'
import { Card } from '../../../card/card'
import { calculateSessionPercentage, categorizeSessions } from './helpers'
import { DisciplineSection } from './discipline-section'

export function TrainingSummary({ trainingSessions }: TrainingSessionListProps) {
  const { indoor, outdoor, indoorRoute, indoorBoulder, outdoorRoute, outdoorBoulder } =
    categorizeSessions(trainingSessions)

  const totalSessions = indoor.length + outdoor.length
  if (totalSessions === 0) return null

  const indoorPercentage = calculateSessionPercentage(indoor.length, outdoor.length)
  const outdoorPercentage = calculateSessionPercentage(outdoor.length, indoor.length)

  return (
    <Card>
      <h2>Training</h2>
      <DisciplineSection
        boulderSessions={indoorBoulder}
        header='Indoor'
        percentage={indoorPercentage}
        routeSessions={indoorRoute}
        sessionCount={indoor.length}
      />
      <DisciplineSection
        boulderSessions={outdoorBoulder}
        header='Outdoor'
        percentage={outdoorPercentage}
        routeSessions={outdoorRoute}
        sessionCount={outdoor.length}
      />
    </Card>
  )
}
