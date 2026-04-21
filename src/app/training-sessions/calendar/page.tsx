import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/shared/components/ui/loader/loader'
import Layout from '~/shared/components/page-layout/page-layout'
import { CalendarContent } from './calendar-content'

export default async function TrainingSessionsCalendarPage() {
  return (
    <Layout layout='flexColumn' title='Training Calendar'>
      <Suspense fallback={<Loader />}>
        <CalendarContent />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Calendar visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'calendar'],
  title: 'Training Sessions Calendar 🖼️',
}
