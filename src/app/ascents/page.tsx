import type { Metadata } from 'next'
import { Suspense } from 'react'
import { api } from '~/trpc/server'
import { FilteredAscentList } from '../_components/filtered-ascents-list/filtered-ascents-list'
import { Loader } from '../_components/loader/loader'
import Layout from '../_components/page-layout/page-layout'

export default async function Page() {
  const ascents = await api.ascents.getAll()

  return (
    <Layout title="Ascents">
      <Suspense fallback={<Loader />}>
        <FilteredAscentList ascents={ascents} />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'View all climbing ascents',
  keywords: ['climbing', 'ascents', 'list'],
  title: 'Ascents 📇',
}
