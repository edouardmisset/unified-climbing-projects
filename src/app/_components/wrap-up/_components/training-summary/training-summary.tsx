import type {
  TrainingSession,
  TrainingSessionListProps,
} from '~/schema/training'
import { Card } from '../../../card/card'
import { Popover } from '../../../popover/popover'
import {
  calculateSessionPercentage,
  categorizeSessions,
  getSessionRatioData,
} from './helpers'
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
  if (totalSessions === 0) return null

  const indoorPercentage = calculateSessionPercentage(
    indoor.length,
    outdoor.length,
  )
  const outdoorPercentage = calculateSessionPercentage(
    outdoor.length,
    indoor.length,
  )

  return (
    <Card>
      <h2>Training</h2>
      <DisciplineSection
        boulderSessions={indoorBoulder}
        header="Indoor"
        percentage={indoorPercentage}
        routeSessions={indoorRoute}
        sessionCount={indoor.length}
      />
      <DisciplineSection
        boulderSessions={outdoorBoulder}
        header="Outdoor"
        percentage={outdoorPercentage}
        routeSessions={outdoorRoute}
        sessionCount={outdoor.length}
      />
    </Card>
  )
}

function DisciplineSection({
  header,
  percentage,
  routeSessions,
  boulderSessions,
  sessionCount,
}: {
  header: string
  percentage: string
  routeSessions: TrainingSession[]
  boulderSessions: TrainingSession[]
  sessionCount: number
}) {
  if (routeSessions.length === 0 && boulderSessions.length === 0) return null

  const {
    firstLabel,
    firstSessions,
    firstCount,
    secondLabel,
    secondSessions,
    secondCount,
    percentage: disciplinePercentage,
  } = getSessionRatioData({
    firstLabel: 'Route',
    firstSessions: routeSessions,
    secondLabel: 'Boulder',
    secondSessions: boulderSessions,
  })

  const sectionTitle = `${header} sessions ${sessionCount}`

  return (
    <>
      <h4 title={sectionTitle}>
        {header} <span className={styles.headerSmall}>({percentage}%)</span>
      </h4>
      <Popover
        popoverDescription={<SessionList sessions={firstSessions} />}
        popoverTitle={`${firstLabel}: ${firstCount} sessions`}
        title={`${firstLabel} Training Sessions: ${firstCount}`}
        triggerClassName={styles.target}
        triggerContent={firstLabel}
      />{' '}
      /{' '}
      <Popover
        popoverDescription={<SessionList sessions={secondSessions} />}
        popoverTitle={`${secondLabel}: ${secondCount} sessions`}
        title={`${secondLabel} Training Sessions: ${secondCount}`}
        triggerClassName={styles.target}
        triggerContent={secondLabel}
      />
      : {disciplinePercentage}%
    </>
  )
}
