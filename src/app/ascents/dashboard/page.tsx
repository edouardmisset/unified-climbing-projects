import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Dashboard } from '~/shared/components/dashboard/dashboard'
import { Loader } from '~/shared/components/ui/loader/loader'
import Layout from '~/shared/components/page-layout/page-layout'
import { getAllAscents } from '~/ascents/services'

export const revalidate = 3_600

export default async function Page() {
  const ascents = await getAllAscents()

  return (
    <Layout title='Dashboard'>
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
