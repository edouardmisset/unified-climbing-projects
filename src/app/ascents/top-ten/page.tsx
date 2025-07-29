import type { Metadata } from 'next'
import { Suspense } from 'react'
import GridLayout from '~/app/_components/grid-layout/grid-layout'
import { Loader } from '~/app/_components/loader/loader'
import { api, HydrateClient } from '~/trpc/server'
import { TableAndSelect } from './_components/table-and-select'

export default async function Page(): Promise<React.JSX.Element> {
  const allAscents = await api.ascents.getAll()
  return (
    <HydrateClient>
      <GridLayout title="Top Ten Ascents">
        <Suspense fallback={<Loader />}>
          <TableAndSelect ascents={allAscents} />
        </Suspense>
      </GridLayout>
    </HydrateClient>
  )
}

export const metadata: Metadata = {
  description: 'Best of my climbing ascents',
  keywords: ['climbing', 'ascents', 'description', 'top ten', 'best'],
  title: 'Top Ten 🔟',
}
