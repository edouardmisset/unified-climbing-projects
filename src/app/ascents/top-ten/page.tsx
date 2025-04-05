import type { Metadata } from 'next'
import { Suspense } from 'react'
import GridLayout from '~/app/_components/grid-layout/grid-layout'
import { Loader } from '~/app/_components/loader/loader'
import { TableAndSelect } from './_components/table-and-select'

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <GridLayout title="Top Ten Ascents">
      <Suspense fallback={<Loader />}>
        <TableAndSelect />
      </Suspense>
    </GridLayout>
  )
}

export const metadata: Metadata = {
  title: 'Top Ten 🔟',
  description: 'Best of my climbing ascents',
  keywords: ['climbing', 'ascents', 'description', 'top ten', 'best'],
}
