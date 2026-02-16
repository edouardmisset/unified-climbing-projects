import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import { getAllAscents } from '~/services/ascents'
import { TableAndSelect } from './_components/table-and-select'

export default async function Page() {
  return (
    <Layout title="Top Ten">
      <Suspense fallback={<Loader />}>
        <TopTenContent />
      </Suspense>
    </Layout>
  )
}

async function TopTenContent() {
  const ascents = await getAllAscents()
  return <TableAndSelect ascents={ascents} />
}

export const metadata: Metadata = {
  description: 'Best of my climbing ascents',
  keywords: ['climbing', 'ascents', 'description', 'top ten', 'best'],
  title: 'Top Ten 🔟',
}
