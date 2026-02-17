'use client'

import { Link } from 'next-view-transitions'
import { memo, Suspense } from 'react'
import NotFound from '~/app/not-found.tsx'
import { LINKS } from '~/constants/links'
import { useTrainingSessionsFilter } from '~/hooks/use-training-sessions-filter'
import type { TrainingSessionListProps } from '~/schema/training.ts'
import { TrainingSessionsIndoorVsOutdoor } from '../charts/training-sessions-indoor-vs-outdoor/training-sessions-indoor-vs-outdoor.tsx'
import { TrainingSessionsPerDiscipline } from '../charts/training-sessions-per-discipline/training-sessions-per-discipline.tsx'
import { TrainingSessionsPerYear } from '../charts/training-sessions-per-year/training-sessions-per-year.tsx'
import { TrainingSessionsRadial } from '../charts/training-sessions-radial/training-sessions-radial.tsx'
import styles from '../dashboard/dashboard.module.css'
import { TrainingDashboardFilterBar } from '../filter-bar/_components/training-dashboard-filter-bar'
import { Loader } from '../loader/loader.tsx'

export function TrainingDashboard({ trainingSessions }: TrainingSessionListProps) {
  const filteredTrainingSessions = useTrainingSessionsFilter(trainingSessions ?? [])

  if (trainingSessions.length === 0) return <NotFound />

  return (
    <div className='flex flexColumn alignCenter gridFullWidth'>
      <TrainingDashboardFilterBar trainingSessions={trainingSessions} />
      <Suspense fallback={<Loader />}>
        <DashboardStats trainingSessions={filteredTrainingSessions} />
      </Suspense>
    </div>
  )
}

const DashboardStats = memo(function DashboardStatistics({
  trainingSessions,
}: TrainingSessionListProps) {
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
      <TrainingSessionsRadial trainingSessions={trainingSessions} />
    </div>
  )
})
