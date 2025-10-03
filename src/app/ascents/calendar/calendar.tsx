import { Suspense } from 'react'
import { DataCalendar } from '~/app/_components/data-calendar/data-calendar'
import { Loader } from '~/app/_components/loader/loader'
import { groupDataDaysByYear } from '~/data/helpers'
import { fromAscentsToCalendarEntries } from '~/helpers/ascent-calendar-helpers'
import type { Ascent } from '~/schema/ascent'

export function AscentCalendar({
  allAscents,
  year,
}: {
  allAscents: Ascent[]
  year: number
}) {
  return (
    <>
      <h2 className="superCenter">{year}</h2>
      <Suspense fallback={<Loader />}>
        <DataCalendar
          data={allAscents}
          dataTransformationFunction={groupDataDaysByYear}
          fromDataToCalendarEntries={(year, ascents) =>
            fromAscentsToCalendarEntries(year, ascents as Ascent[][])
          }
          key={year}
          year={year}
        />
      </Suspense>
    </>
  )
}
