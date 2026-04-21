import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAllTrainingSessions } from '~/training/services'
import { FilteredTrainingSessionList } from '~/training/components/filtered-training-sessions-list/filtered-training-sessions-list'
import { Loader } from '~/shared/components/ui/loader/loader'
import Layout from '~/shared/components/page-layout/page-layout'

export const revalidate = 3_600

export default async function TrainingSessionsPage() {
  const trainingSessions = await getAllTrainingSessions()

  return (
    <Layout title='Training'>
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
