import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import { api } from '~/trpc/server'
import { TableAndSelect } from './_components/table-and-select'

export default async function Page() {
  const ascents = await api.ascents.getAll()

  return (
    <Layout title="Top Ten Ascents">
      <Suspense fallback={<Loader />}>
        <TableAndSelect ascents={ascents} />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Best of my climbing ascents',
  keywords: ['climbing', 'ascents', 'description', 'top ten', 'best'],
  title: 'Top Ten 🔟',
}
