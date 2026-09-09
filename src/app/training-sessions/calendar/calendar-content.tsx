import { DataCalendar } from '~/app/_components/data-calendar/data-calendar'
import { CalendarLegend } from '~/app/_components/data-calendar/calendar-legend'
import { CalendarYear } from '~/app/_components/data-calendar/calendar-year'
import NotFound from '~/app/not-found'
import { createYearList, groupDataDaysByYear } from '~/data/helpers'
import type { TrainingSessionListRecord } from '~/domain/training-session'
import { fromTrainingSessionsToCalendarEntries } from '~/helpers/training-calendar-helpers'
import { getAllAscents } from '~/services/ascents'
import { getAllTrainingSessions } from '~/services/training'

export async function CalendarContent() {
  const [trainingSessions, allAscents] = await Promise.all([
    getAllTrainingSessions(),
    getAllAscents(),
  ])

  if (trainingSessions.length === 0 || allAscents.length === 0) return <NotFound />

  const trainingYears = createYearList(trainingSessions, { continuous: false })

  return (
    <>
      {trainingYears.map((year, index) => (
        <CalendarYear isLatestYear={index === 0} key={year} year={year}>
          <DataCalendar
            data={trainingSessions}
            dataTransformationFunction={groupDataDaysByYear<TrainingSessionListRecord>}
            fromDataToCalendarEntries={(calendarYear, sessions) =>
              fromTrainingSessionsToCalendarEntries(calendarYear, sessions, allAscents)
            }
            year={year}
          />
        </CalendarYear>
      ))}
      <CalendarLegend
        items={[
          { color: 'var(--endurance)', label: 'Endurance' },
          { color: 'var(--strength)', label: 'Strength' },
          { color: 'var(--stamina)', label: 'Skill & stamina' },
          { color: 'var(--tapered)', label: 'Recovery' },
          { color: 'var(--outdoor)', label: 'Outdoor' },
          { color: 'var(--otherTraining)', label: 'Other' },
        ]}
        note='Cell labels show the session type; shade shows intensity or volume.'
      />
    </>
  )
}
