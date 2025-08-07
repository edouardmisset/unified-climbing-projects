import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Dashboard } from '~/app/_components/dashboard/dashboard'
import GridLayout from '~/app/_components/grid-layout/grid-layout'
import { Loader } from '~/app/_components/loader/loader'
import { api } from '~/trpc/server'

export default async function Page() {
  const ascents = await api.ascents.getAll()
  return (
    <GridLayout title="Dashboard">
      <Suspense fallback={<Loader />}>
        <Dashboard ascents={ascents} />
      </Suspense>
    </GridLayout>
  )
}

export const metadata: Metadata = {
  description: 'Contemplate ascents charts and statistics',
  keywords: ['climbing', 'statistics', 'charts', 'dashboard', 'filter'],
  title: 'Dashboard 📊',
}
