import { Fragment, Suspense } from 'react'
import { DataCalendar } from '~/app/_components/data-calendar/data-calendar'
import { Loader } from '~/app/_components/loader/loader'
import NotFound from '~/app/not-found'
import { GridBreakOutWrapper } from '~/app/visualization/_components/grid-break-out-wrapper/grid-break-out-wrapper'
import { createYearList, groupDataDaysByYear } from '~/data/helpers'
import { fromAscentsToCalendarEntries } from '~/helpers/ascent-calendar-helpers'
import type { Ascent } from '~/schema/ascent'
import { api } from '~/trpc/server'

export default async function AscentsCalendarPage() {
  const allAscents = await api.ascents.getAll()

  if (!allAscents) return <NotFound />

  const ascentYears = createYearList(allAscents)

  return (
    <Suspense fallback={<Loader />}>
      <GridBreakOutWrapper>
        {ascentYears.map(year => (
          <Fragment key={year}>
            <h2 className="super-center">{year}</h2>
            <DataCalendar
              key={year}
              year={year}
              data={allAscents}
              dataTransformationFunction={groupDataDaysByYear}
              fromDataToCalendarEntries={(year, ascents) =>
                fromAscentsToCalendarEntries(year, ascents as Ascent[][])
              }
            />
          </Fragment>
        ))}
      </GridBreakOutWrapper>
    </Suspense>
  )
}

export const metadata = {
  title: 'Ascents Calendar 🖼️',
  description: 'Calendar visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'calendar'],
}
