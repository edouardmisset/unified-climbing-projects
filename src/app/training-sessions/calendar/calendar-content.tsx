import { Fragment } from 'react'
import { DataCalendar } from '~/app/_components/data-calendar/data-calendar'
import NotFound from '~/app/not-found'
import { createYearList, groupDataDaysByYear } from '~/data/helpers'
import { fromTrainingSessionsToCalendarEntries } from '~/helpers/training-calendar-helpers'
import type { TrainingSession } from '~/schema/training'
import { getAllTrainingSessions } from '~/services/training'

export async function CalendarContent() {
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
            dataTransformationFunction={groupDataDaysByYear<TrainingSession>}
            fromDataToCalendarEntries={(calendarYear, sessions) =>
              fromTrainingSessionsToCalendarEntries(calendarYear, sessions)
            }
            year={year}
          />
        </Fragment>
      ))}
    </>
  )
}
