import type { Metadata } from 'next'
import { Fragment } from 'react'
import { trainingTransformConfig } from '~/app/_components/data-calendar'
import { DataCalendar } from '~/app/_components/data-calendar/data-calendar'
import Layout from '~/app/_components/page-layout/page-layout'
import NotFound from '~/app/not-found'
import { createYearList } from '~/data/helpers'
import { api } from '~/trpc/server'

export default async function TrainingSessionsCalendarPage() {
  const trainingSessions = await api.training.getAll()

  if (!trainingSessions) return <NotFound />

  const trainingYears = createYearList(trainingSessions, { continuous: false })

  return (
    <Layout layout="flexColumn" title="Training Calendar">
      {trainingYears.map(year => (
        <Fragment key={year}>
          <h2 className="superCenter">{year}</h2>
          <DataCalendar
            config={trainingTransformConfig}
            data={trainingSessions}
            year={year}
          />
        </Fragment>
      ))}
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Calendar visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'calendar'],
  title: 'Training Sessions Calendar 🖼️',
}
