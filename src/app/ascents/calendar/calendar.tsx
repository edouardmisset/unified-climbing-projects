import { Suspense } from 'react'
import { DataCalendar } from '~/shared/components/data-calendar/data-calendar'
import { Loader } from '~/shared/components/ui/loader/loader'
import { groupDataDaysByYear } from '~/shared/data/helpers'
import { fromAscentsToCalendarEntries } from '~/ascents/helpers/ascent-calendar-helpers'
import type { Ascent } from '~/ascents/schema'

export function AscentCalendar({ allAscents, year }: { allAscents: Ascent[]; year: number }) {
  return (
    <>
      <h2 className='superCenter'>{year}</h2>
      <Suspense fallback={<Loader />}>
        <DataCalendar
          data={allAscents}
          dataTransformationFunction={groupDataDaysByYear<Ascent>}
          fromDataToCalendarEntries={(calendarYear, ascents) =>
            fromAscentsToCalendarEntries(calendarYear, ascents)
          }
          key={year}
          year={year}
        />
      </Suspense>
    </>
  )
}
