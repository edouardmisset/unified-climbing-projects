import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/shared/components/ui/loader/loader'
import Layout from '~/shared/components/page-layout/page-layout'
import { TrainingDashboard } from '~/training/components/training-dashboard/training-dashboard'
import { getAllTrainingSessions } from '~/training/services'

export const revalidate = 3_600

export default async function Page() {
  const trainingSessions = await getAllTrainingSessions()

  return (
    <Layout title='Training Dashboard'>
      <Suspense fallback={<Loader />}>
        <TrainingDashboard trainingSessions={trainingSessions} />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Visualize training session statistics and patterns',
  keywords: ['training', 'statistics', 'charts', 'dashboard', 'filter'],
  title: 'Training Dashboard 📊',
}
