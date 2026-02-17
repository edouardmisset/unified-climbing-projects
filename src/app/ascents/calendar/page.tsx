import { filterByDate } from '@edouardmisset/array'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import NotFound from '~/app/not-found'
import { createYearList } from '~/data/helpers'
import { getAllAscents } from '~/services/ascents'
import { AscentCalendar } from './calendar'

export default async function AscentsCalendarPage() {
  return (
    <Layout layout='flexColumn' title='Ascents Calendar'>
      <Suspense fallback={<Loader />}>
        <CalendarContent />
      </Suspense>
    </Layout>
  )
}

async function CalendarContent() {
  const allAscents = await getAllAscents()

  if (!allAscents) return <NotFound />

  const ascentYearsData = createYearList(allAscents, {
    continuous: false,
    descending: true,
  }).map(year => [year, allAscents.filter(filterByDate('date', { year }))] as const)

  return (
    <>
      {ascentYearsData.map(([year, ascents]) => (
        <AscentCalendar allAscents={ascents} key={year} year={year} />
      ))}
    </>
  )
}

export const metadata: Metadata = {
  description: 'Calendar visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'calendar'],
  title: 'Ascents Calendar 🖼️',
}
