import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAllAscents } from '~/ascents/services'
import { FilteredAscentList } from '~/ascents/components/filtered-ascents-list/filtered-ascents-list'
import { Loader } from '~/shared/components/ui/loader/loader'
import Layout from '~/shared/components/page-layout/page-layout'

export const revalidate = 3_600

export default async function Page() {
  const ascents = await getAllAscents()

  return (
    <Layout title='Ascents'>
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
