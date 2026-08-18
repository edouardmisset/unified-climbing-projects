import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '../_components/ui/loader/loader'
import Layout from '../_components/page-layout/page-layout'
import { AscentList } from './ascents-content'

export default function Page() {
  return (
    <Layout title='Browse ascents'>
      <Suspense fallback={<Loader />}>
        <AscentList />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'View all climbing ascents',
  keywords: ['climbing', 'ascents', 'list'],
  title: 'Ascents 📇',
}
