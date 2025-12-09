import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import type { Ascent } from '~/schema/ascent'
import { api } from '~/trpc/server'
import { AscentCalendar } from './calendar'

export default function AscentsCalendarPage() {
  const allAscentsPromise = api.ascents.getAll()
  const yearsPromise = api.ascents.getYears()

  return (
    <Layout layout="flexColumn" title="Ascents Calendar">
      <Suspense fallback={<Loader />}>
        <CalendarList
          dataPromise={allAscentsPromise}
          yearsPromise={yearsPromise}
        />
      </Suspense>
    </Layout>
  )
}

async function CalendarList({
  yearsPromise,
  dataPromise,
}: {
  yearsPromise: Promise<number[]>
  dataPromise: Promise<Ascent[]>
}) {
  const years = await yearsPromise

  return years.map(year => (
    <AscentCalendar allAscents={dataPromise} key={year} year={year} />
  ))
}

export const metadata: Metadata = {
  description: 'Calendar visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'calendar'],
  title: 'Ascents Calendar 🖼️',
}
