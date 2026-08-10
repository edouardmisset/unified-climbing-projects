import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '../_components/ui/loader/loader'
import Layout from '../_components/page-layout/page-layout'
import { TrainingSessionList } from './training-sessions-content'

export default function TrainingSessionsPage() {
  return (
    <Layout title='Training'>
      <Suspense fallback={<Loader />}>
        <TrainingSessionList />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Lists my training sessions',
  keywords: ['climbing', 'training', 'sessions'],
  title: 'Training Sessions 💪',
}
