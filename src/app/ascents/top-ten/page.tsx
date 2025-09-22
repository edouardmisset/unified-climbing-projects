import type { Metadata } from 'next'
import { Suspense } from 'react'
import GridLayout from '~/app/_components/grid-layout/grid-layout'
import { Loader } from '~/app/_components/loader/loader'
import { getAllAscentsFromDB } from '~/services/convex'
import { TableAndSelect } from './_components/table-and-select'

export default async function Page() {
  const ascents = await getAllAscentsFromDB()
  return (
    <GridLayout title="Top Ten Ascents">
      <Suspense fallback={<Loader />}>
        <TableAndSelect ascents={ascents} />
      </Suspense>
    </GridLayout>
  )
}

export const metadata: Metadata = {
  description: 'Best of my climbing ascents',
  keywords: ['climbing', 'ascents', 'description', 'top ten', 'best'],
  title: 'Top Ten 🔟',
}
