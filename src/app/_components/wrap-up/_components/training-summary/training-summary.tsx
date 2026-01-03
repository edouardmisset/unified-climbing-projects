import { roundToTen } from '~/helpers/math'
import type {
  TrainingSession,
  TrainingSessionListProps,
} from '~/schema/training'
import { Card } from '../../../card/card'
import { Popover } from '../../../popover/popover'
import { calculatePercentage, categorizeSessions } from './helpers'
import { SessionList } from './session-list'
import styles from './training-summary.module.css'

export function TrainingSummary({
  trainingSessions,
}: TrainingSessionListProps) {
  const {
    indoor,
    outdoor,
    indoorRoute,
    indoorBoulder,
    outdoorRoute,
    outdoorBoulder,
  } = categorizeSessions(trainingSessions)

  const totalSessions = indoor.length + outdoor.length
  if (totalSessions === 0) return

  const indoorPercentage = roundToTen((indoor.length / totalSessions) * 100)
  const outdoorPercentage = roundToTen((outdoor.length / totalSessions) * 100)

  const sessionTypeStats = calculatePercentage({
    firstLabel: 'Indoor',
    firstSessions: indoor,
    secondLabel: 'Outdoor',
    secondSessions: outdoor,
  })

  return (
    <Card>
      <h2>Training</h2>
      <DisciplineSection
        boulderSessions={indoorBoulder}
        header="Indoor"
        percentage={indoorPercentage}
        routeSessions={indoorRoute}
        title={`Indoor sessions ${sessionTypeStats.firstCount}`}
      />
      <DisciplineSection
        boulderSessions={outdoorBoulder}
        header="Outdoor"
        percentage={outdoorPercentage}
        routeSessions={outdoorRoute}
        title={`Outdoor sessions ${sessionTypeStats.secondCount}`}
      />
    </Card>
  )
}

function DisciplineSection({
  title,
  header,
  percentage,
  routeSessions,
  boulderSessions,
}: {
  title: string
  header: string
  percentage: number
  routeSessions: TrainingSession[]
  boulderSessions: TrainingSession[]
}) {
  if (routeSessions.length === 0 && boulderSessions.length === 0) return null

  const stats = calculatePercentage({
    firstLabel: 'Route',
    firstSessions: routeSessions,
    secondLabel: 'Boulder',
    secondSessions: boulderSessions,
  })

  return (
    <>
      <h4 title={title}>
        {header} <span className={styles.headerSmall}>({percentage}%)</span>
      </h4>
      <Popover
        popoverDescription={<SessionList sessions={stats.firstSessions} />}
        popoverTitle={`${stats.firstLabel}: ${stats.firstCount} sessions`}
        title={`${stats.firstLabel} Training Sessions: ${stats.firstCount}`}
        triggerClassName={styles.target}
        triggerContent={stats.firstLabel}
      />{' '}
      /{' '}
      <Popover
        popoverDescription={<SessionList sessions={stats.secondSessions} />}
        popoverTitle={`${stats.secondLabel}: ${stats.secondCount} sessions`}
        title={`${stats.secondLabel} Training Sessions: ${stats.secondCount}`}
        triggerClassName={styles.target}
        triggerContent={stats.secondLabel}
      />
      : {stats.percentage}%
    </>
  )
}
