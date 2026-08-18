import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TrainingSessionList } from '~/app/training-sessions/training-sessions-content'
import Layout from '~/app/_components/page-layout/page-layout'
import { Loader } from '~/app/_components/ui/loader/loader'

export default function TrainingRecordsPage() {
  return (
    <Layout title='Browse training'>
      <Suspense fallback={<Loader />}>
        <TrainingSessionList />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'View all training sessions.',
  title: 'Browse · Training',
}
