'use client'

import { Fragment, use } from 'react'
import { renderTrainingDay } from '~/app/_components/data-calendar'
import { DataCalendar } from '~/app/_components/data-calendar/data-calendar'
import type { TrainingSession } from '~/schema/training'

interface CalendarListProps {
  yearsPromise: Promise<number[]>
  dataPromise: Promise<TrainingSession[]>
}

export function CalendarList({ yearsPromise, dataPromise }: CalendarListProps) {
  const years = use(yearsPromise)

  return (
    <>
      {years.map(year => (
        <Fragment key={year}>
          <h2 className="centerText">{year}</h2>
          <DataCalendar<TrainingSession>
            data={dataPromise}
            renderDay={renderTrainingDay}
            year={year}
          />
        </Fragment>
      ))}
    </>
  )
}
