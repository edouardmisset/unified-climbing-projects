import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/shared/components/ui/loader/loader'
import Layout from '~/shared/components/page-layout/page-layout'
import { TopTenContent } from './top-ten-content'

export default async function Page() {
  return (
    <Layout title='Top Ten'>
      <Suspense fallback={<Loader />}>
        <TopTenContent />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Best of my climbing ascents',
  keywords: ['climbing', 'ascents', 'description', 'top ten', 'best'],
  title: 'Top Ten 🔟',
}
