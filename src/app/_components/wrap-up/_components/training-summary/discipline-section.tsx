import type { TrainingSession } from '~/schema/training'
import { formatNumber } from '~/helpers/number-formatter'
import { Popover } from '../../../ui/popover/popover'
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

  if (routeSessions.length === 0 && boulderSessions.length === 0) return

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

  const sectionTitle = `${header} sessions ${formatNumber(sessionCount)}`

  return (
    <>
      <h4 title={sectionTitle}>
        {header} <span className={styles.headerSmall}>({percentage})</span>
      </h4>
      <Popover
        className={styles.target}
        popoverTitle={`${firstLabel}: ${formatNumber(firstCount)} sessions`}
        title={`${firstLabel} Training Sessions: ${formatNumber(firstCount)}`}
        trigger={firstLabel}
      >
        <SessionList sessions={firstSessions} />
      </Popover>{' '}
      /{' '}
      <Popover
        className={styles.target}
        popoverTitle={`${secondLabel}: ${formatNumber(secondCount)} sessions`}
        title={`${secondLabel} Training Sessions: ${formatNumber(secondCount)}`}
        trigger={secondLabel}
      >
        <SessionList sessions={secondSessions} />
      </Popover>
      : {disciplinePercentage}
    </>
  )
}
