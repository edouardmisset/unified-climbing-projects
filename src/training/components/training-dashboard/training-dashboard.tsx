'use client'

import { Suspense } from 'react'
import NotFound from '~/app/not-found.tsx'
import { useTrainingSessionsFilter } from '~/training/hooks/use-training-sessions-filter'
import type { TrainingSessionListProps } from '~/training/schema.ts'
import { DashboardStats } from './dashboard-stats'
import { TrainingDashboardFilterBar } from '~/shared/components/filter-bar/_components/training-dashboard-filter-bar'
import { Loader } from '~/shared/components/ui/loader/loader.tsx'

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
