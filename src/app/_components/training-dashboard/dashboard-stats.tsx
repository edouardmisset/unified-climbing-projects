import { Link } from 'next-view-transitions'
import { memo } from 'react'
import { LINKS } from '~/constants/links'
import type { TrainingSessionListProps } from '~/schema/training.ts'
import { TrainingSessionsIndoorVsOutdoor } from '../charts/training-sessions-indoor-vs-outdoor/training-sessions-indoor-vs-outdoor.tsx'
import { TrainingSessionsPerDiscipline } from '../charts/training-sessions-per-discipline/training-sessions-per-discipline.tsx'
import { TrainingSessionsPerYear } from '../charts/training-sessions-per-year/training-sessions-per-year.tsx'
import { TrainingSessionsDistribution } from '../charts/training-sessions-distribution/training-sessions-distribution.tsx'
import styles from '../dashboard/dashboard.module.css'

type DashboardStatsProps = TrainingSessionListProps

function DashboardStatsComponent(props: DashboardStatsProps) {
  const { trainingSessions } = props

  return trainingSessions.length === 0 ? (
    <div className='flexColumn gap w100 padding'>
      <h2>Nothing there...</h2>
      <p>
        Try <Link href={LINKS.trainingSessionForm}>logging new training sessions</Link>.
      </p>
    </div>
  ) : (
    <div className={styles.container}>
      <TrainingSessionsPerDiscipline trainingSessions={trainingSessions} />
      <TrainingSessionsIndoorVsOutdoor trainingSessions={trainingSessions} />
      <TrainingSessionsPerYear trainingSessions={trainingSessions} />
      <TrainingSessionsDistribution trainingSessions={trainingSessions} />
    </div>
  )
}

export const DashboardStats = memo(DashboardStatsComponent)
