import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Dashboard } from '~/app/_components/dashboard/dashboard'
import { Loader } from '~/app/_components/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import { api } from '~/trpc/server'

export default async function Page() {
  const ascents = await api.ascents.getAll()

  return (
    <Layout title="Dashboard">
      <Suspense fallback={<Loader />}>
        <Dashboard ascents={ascents} />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Contemplate ascents charts and statistics',
  keywords: ['climbing', 'statistics', 'charts', 'dashboard', 'filter'],
  title: 'Dashboard 📊',
}
