import { filterByDate } from '@edouardmisset/array'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import NotFound from '~/app/not-found'
import { createYearList } from '~/data/helpers'
import { api } from '~/trpc/server'
import { AscentCalendar } from './calendar'

export default async function AscentsCalendarPage() {
  const allAscents = await api.ascents.getAll()

  if (!allAscents) return <NotFound />

  const ascentYearsData = createYearList(allAscents, {
    continuous: false,
    descending: true,
  }).map(
    year => [year, allAscents.filter(filterByDate('date', { year }))] as const,
  )

  return (
    <Layout layout="flexColumn" title="Ascents Calendar">
      <Suspense fallback={<Loader />}>
        {ascentYearsData.map(([year, ascents]) => (
          <AscentCalendar allAscents={ascents} key={year} year={year} />
        ))}
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Calendar visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'calendar'],
  title: 'Ascents Calendar 🖼️',
}
