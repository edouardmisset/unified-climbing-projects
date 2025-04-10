import type { Metadata } from 'next'
import { Suspense } from 'react'
import { api } from '~/trpc/server'
import { FilteredAscentList } from '../_components/filtered-ascents-list/filtered-ascents-list'
import GridLayout from '../_components/grid-layout/grid-layout'
import { Loader } from '../_components/loader/loader'

export default async function Page() {
  const ascents = await api.ascents.getAll()
  return (
    <GridLayout title="Ascents">
      <Suspense fallback={<Loader />}>
        <FilteredAscentList ascents={ascents} />
      </Suspense>
    </GridLayout>
  )
}

export const metadata: Metadata = {
  title: 'Ascents 📇',
  description: 'View all climbing ascents',
  keywords: ['climbing', 'ascents', 'list'],
}
