import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import calendarStyles from '~/app/_components/data-calendar/data-calendar.module.css'
import Layout from '~/app/_components/page-layout/page-layout'
import { CalendarContent } from './calendar-content'

export default function AscentsCalendarPage() {
  return (
    <Layout
      fullScreenOnPhoneLandscape
      gridClassName={calendarStyles.calendarPage}
      layout='flexColumn'
      title='Ascents Calendar'
    >
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
