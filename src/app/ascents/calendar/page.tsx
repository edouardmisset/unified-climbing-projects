import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import { CalendarContent } from './calendar-content'

export default async function AscentsCalendarPage() {
  return (
    <Layout layout='flexColumn' title='Ascents Calendar'>
      <Suspense fallback={<Loader />}>
        <CalendarContent />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Calendar visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'calendar'],
  title: 'Ascents Calendar 🖼️',
}
