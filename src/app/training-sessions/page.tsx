import type { Metadata } from 'next'
import { Suspense } from 'react'
import { api } from '~/trpc/server'
import { FilteredTrainingSessionList } from '../_components/filtered-training-sessions-list/filtered-training-sessions-list'
import GridLayout from '../_components/grid-layout/grid-layout'
import { Loader } from '../_components/loader/loader'

export default async function TrainingSessionsPage() {
  const trainingSessions = await api.training.getAll()

  return (
    <GridLayout title="Training Sessions">
      <Suspense fallback={<Loader />}>
        <FilteredTrainingSessionList trainingSessions={trainingSessions} />
      </Suspense>
    </GridLayout>
  )
}

export const metadata: Metadata = {
  description: 'Lists my training sessions',
  keywords: ['climbing', 'training', 'sessions'],
  title: 'Training Sessions 💪',
}
