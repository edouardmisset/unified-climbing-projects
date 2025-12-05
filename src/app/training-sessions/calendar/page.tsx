import type { Metadata } from 'next'
import { Fragment } from 'react'
import { DataCalendar } from '~/app/_components/data-calendar/data-calendar'
import Layout from '~/app/_components/page-layout/page-layout'
import NotFound from '~/app/not-found'
import { createYearList, groupDataDaysByYear } from '~/data/helpers'
import { fromTrainingSessionsToCalendarEntries } from '~/helpers/training-calendar-helpers'
import type { TrainingSession } from '~/schema/training'
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
            data={trainingSessions}
            dataTransformationFunction={groupDataDaysByYear}
            fromDataToCalendarEntries={(calendarYear, sessions) =>
              fromTrainingSessionsToCalendarEntries(
                calendarYear,
                sessions as TrainingSession[][],
              )
            }
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
