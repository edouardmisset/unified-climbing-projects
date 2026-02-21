import dynamic from 'next/dynamic'
import { Link } from 'next-view-transitions'
import { memo } from 'react'
import { LINKS } from '~/constants/links'
import type { TrainingSessionListProps } from '~/schema/training.ts'
import styles from '../dashboard/dashboard.module.css'

const TrainingSessionsIndoorVsOutdoor = dynamic(
  () => import('../charts/training-sessions-indoor-vs-outdoor/training-sessions-indoor-vs-outdoor.tsx').then(m => m.TrainingSessionsIndoorVsOutdoor),
  { ssr: false }
)
const TrainingSessionsPerDiscipline = dynamic(
  () => import('../charts/training-sessions-per-discipline/training-sessions-per-discipline.tsx').then(m => m.TrainingSessionsPerDiscipline),
  { ssr: false }
)
const TrainingSessionsPerYear = dynamic(
  () => import('../charts/training-sessions-per-year/training-sessions-per-year.tsx').then(m => m.TrainingSessionsPerYear),
  { ssr: false }
)
const TrainingSessionsDistribution = dynamic(
  () => import('../charts/training-sessions-distribution/training-sessions-distribution.tsx').then(m => m.TrainingSessionsDistribution),
  { ssr: false }
)

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
