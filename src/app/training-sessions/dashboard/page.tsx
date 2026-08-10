import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import { DashboardContent } from './dashboard-content'

export default function Page() {
  return (
    <Layout title='Training Dashboard'>
      <Suspense fallback={<Loader />}>
        <DashboardContent />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Visualize training session statistics and patterns',
  keywords: ['training', 'statistics', 'charts', 'dashboard', 'filter'],
  title: 'Training Dashboard 📊',
}
