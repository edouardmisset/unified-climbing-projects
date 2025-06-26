import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Dashboard } from '~/app/_components/dashboard/dashboard'
import GridLayout from '~/app/_components/grid-layout/grid-layout'
import { Loader } from '~/app/_components/loader/loader'

export default function Page() {
  return (
    <GridLayout title="Dashboard">
      <Suspense fallback={<Loader />}>
        <Dashboard />
      </Suspense>
    </GridLayout>
  )
}

export const metadata: Metadata = {
  description: 'Contemplate ascents charts and statistics',
  keywords: ['climbing', 'statistics', 'charts', 'dashboard', 'filter'],
  title: 'Dashboard 📊',
}
