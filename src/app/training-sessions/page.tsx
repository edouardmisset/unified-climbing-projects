import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAllTrainingSessions } from '~/services/training'
import { FilteredTrainingSessionList } from '../_components/filtered-training-sessions-list/filtered-training-sessions-list'
import { Loader } from '../_components/loader/loader'
import Layout from '../_components/page-layout/page-layout'

export const revalidate = 86_400

export default async function TrainingSessionsPage() {
  const trainingSessions = await getAllTrainingSessions()

  return (
    <Layout title="Training">
      <Suspense fallback={<Loader />}>
        <FilteredTrainingSessionList trainingSessions={trainingSessions} />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Lists my training sessions',
  keywords: ['climbing', 'training', 'sessions'],
  title: 'Training Sessions 💪',
}
