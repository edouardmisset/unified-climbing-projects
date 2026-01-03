import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import { TrainingDashboard } from '~/app/_components/training-dashboard/training-dashboard'
import { api } from '~/trpc/server'

export default async function Page() {
  const trainingSessions = await api.training.getAll()

  return (
    <Layout title="Training Dashboard">
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
