import type { TrainingSession } from '~/schema/training'
import { Popover } from '../../../popover/popover'
import { getSessionRatioData } from './helpers'
import { SessionList } from './session-list'
import styles from './training-summary.module.css'

type DisciplineSectionProps = {
  header: string
  percentage: string
  routeSessions: TrainingSession[]
  boulderSessions: TrainingSession[]
  sessionCount: number
}

export function DisciplineSection(props: DisciplineSectionProps) {
  const { header, percentage, routeSessions, boulderSessions, sessionCount } = props

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
