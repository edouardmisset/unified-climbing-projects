import type { Metadata } from 'next'
import { Suspense } from 'react'
import GridLayout from '~/app/_components/grid-layout/grid-layout'
import { Loader } from '~/app/_components/loader/loader'
import type { Timeframe } from '~/schema/generic'
import { api } from '~/trpc/server'
import { TableAndSelect } from './_components/table-and-select'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ timeframe: Timeframe | undefined }>
}): Promise<React.JSX.Element> {
  const topTen = await api.ascents.getTopTen({
    timeframe: (await searchParams).timeframe || 'year',
  })
  return (
    <GridLayout title="Top Ten Ascents">
      <Suspense fallback={<Loader />}>
        <TableAndSelect initialTopTen={topTen} />
      </Suspense>
    </GridLayout>
  )
}

export const metadata: Metadata = {
  description: 'Best of my climbing ascents',
  keywords: ['climbing', 'ascents', 'description', 'top ten', 'best'],
  title: 'Top Ten 🔟',
}
