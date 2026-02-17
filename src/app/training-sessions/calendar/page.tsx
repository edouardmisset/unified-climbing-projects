import type { Metadata } from 'next'
import { Fragment, Suspense } from 'react'
import { DataCalendar } from '~/app/_components/data-calendar/data-calendar'
import { Loader } from '~/app/_components/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import NotFound from '~/app/not-found'
import { createYearList, groupDataDaysByYear } from '~/data/helpers'
import { fromTrainingSessionsToCalendarEntries } from '~/helpers/training-calendar-helpers'
import type { TrainingSession } from '~/schema/training'
import { getAllTrainingSessions } from '~/services/training'

export default async function TrainingSessionsCalendarPage() {
  return (
    <Layout layout='flexColumn' title='Training Calendar'>
      <Suspense fallback={<Loader />}>
        <CalendarContent />
      </Suspense>
    </Layout>
  )
}

async function CalendarContent() {
  const trainingSessions = await getAllTrainingSessions()

  if (!trainingSessions) return <NotFound />

  const trainingYears = createYearList(trainingSessions, { continuous: false })

  return (
    <>
      {trainingYears.map(year => (
        <Fragment key={year}>
          <h2 className='superCenter'>{year}</h2>
          <DataCalendar
            data={trainingSessions}
            dataTransformationFunction={groupDataDaysByYear}
            fromDataToCalendarEntries={(calendarYear, sessions) =>
              fromTrainingSessionsToCalendarEntries(calendarYear, sessions as TrainingSession[][])
            }
            year={year}
          />
        </Fragment>
      ))}
    </>
  )
}

export const metadata: Metadata = {
  description: 'Calendar visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'calendar'],
  title: 'Training Sessions Calendar 🖼️',
}
