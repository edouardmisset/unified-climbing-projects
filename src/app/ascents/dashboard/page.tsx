import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import { DashboardContent } from './dashboard-content'

export default function Page() {
  return (
    <Layout title='Dashboard'>
      <Suspense fallback={<Loader />}>
        <DashboardContent />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Contemplate ascents charts and statistics',
  keywords: ['climbing', 'statistics', 'charts', 'dashboard', 'filter'],
  title: 'Dashboard 📊',
}
