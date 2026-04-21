import { Fragment } from 'react'
import { DataCalendar } from '~/shared/components/data-calendar/data-calendar'
import NotFound from '~/app/not-found'
import { createYearList, groupDataDaysByYear } from '~/shared/data/helpers'
import { fromTrainingSessionsToCalendarEntries } from '~/training/helpers/training-calendar-helpers'
import type { TrainingSession } from '~/training/schema'
import { getAllAscents } from '~/ascents/services'
import { getAllTrainingSessions } from '~/training/services'

export async function CalendarContent() {
  const [trainingSessions, allAscents] = await Promise.all([
    getAllTrainingSessions(),
    getAllAscents(),
  ])

  if (!trainingSessions) return <NotFound />

  const trainingYears = createYearList(trainingSessions, { continuous: false })

  return (
    <>
      {trainingYears.map(year => (
        <Fragment key={year}>
          <h2 className='superCenter'>{year}</h2>
          <DataCalendar
            data={trainingSessions}
            dataTransformationFunction={groupDataDaysByYear<TrainingSession>}
            fromDataToCalendarEntries={(calendarYear, sessions) =>
              fromTrainingSessionsToCalendarEntries(calendarYear, sessions, allAscents ?? [])
            }
            year={year}
          />
        </Fragment>
      ))}
    </>
  )
}
