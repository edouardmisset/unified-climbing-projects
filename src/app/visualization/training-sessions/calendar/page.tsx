import { Fragment, Suspense } from 'react'
import { DataCalendar } from '~/app/_components/data-calendar/data-calendar'
import { trainingTransformConfig } from '~/app/_components/data-calendar/transform-configs'
import { Loader } from '~/app/_components/loader/loader'
import NotFound from '~/app/not-found'
import { GridBreakOutWrapper } from '~/app/visualization/_components/grid-break-out-wrapper/grid-break-out-wrapper'
import { createYearList } from '~/data/helpers'
import { api } from '~/trpc/server'

export default async function TrainingSessionsCalendarPage() {
  const trainingSessions = await api.training.getAll()

  if (!trainingSessions) return <NotFound />

  const trainingYears = createYearList(trainingSessions, { continuous: false })

  return (
    <Suspense fallback={<Loader />}>
      <GridBreakOutWrapper>
        {trainingYears.map(year => (
          <Fragment key={year}>
            <h2 className="super-center">{year}</h2>
            <DataCalendar
              data={trainingSessions}
              config={trainingTransformConfig}
              year={year}
            />
          </Fragment>
        ))}
      </GridBreakOutWrapper>
    </Suspense>
  )
}

export const metadata = {
  description: 'Calendar visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'calendar'],
  title: 'Training Sessions Calendar 🖼️',
}
