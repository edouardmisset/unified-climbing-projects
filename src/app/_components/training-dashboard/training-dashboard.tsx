'use client'

import { Suspense } from 'react'
import NotFound from '~/app/not-found.tsx'
import { useTrainingSessionsFilter } from '~/hooks/use-training-sessions-filter'
import type { TrainingSessionListProps } from '~/schema/training.ts'
import { DashboardStats } from './dashboard-stats'
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
