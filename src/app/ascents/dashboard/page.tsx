import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Dashboard } from '~/app/_components/dashboard/dashboard'
import GridLayout from '~/app/_components/grid-layout/grid-layout'
import { Loader } from '~/app/_components/loader/loader'
import { getAllAscentsFromDB } from '~/services/convex'

export default async function Page() {
  const ascents = await getAllAscentsFromDB()

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
