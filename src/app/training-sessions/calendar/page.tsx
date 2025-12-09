import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import { api } from '~/trpc/server'
import { CalendarList } from './calendar-list'

export default function TrainingSessionsCalendarPage() {
  const trainingSessionsPromise = api.training.getAll()
  const yearsPromise = api.training.getYears()

  return (
    <Layout layout="flexColumn" title="Training Calendar">
      <Suspense fallback={<Loader />}>
        <CalendarList
          dataPromise={trainingSessionsPromise}
          yearsPromise={yearsPromise}
        />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Calendar visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'calendar'],
  title: 'Training Sessions Calendar 🖼️',
}
