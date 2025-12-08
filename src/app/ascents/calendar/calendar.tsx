import { Suspense } from 'react'
import { ascentTransformConfig } from '~/app/_components/data-calendar'
import { DataCalendar } from '~/app/_components/data-calendar/data-calendar'
import { Loader } from '~/app/_components/loader/loader'
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
      <h2 className="centerText">{year}</h2>
      <Suspense fallback={<Loader />}>
        <DataCalendar
          config={ascentTransformConfig}
          data={allAscents}
          key={year}
          year={year}
        />
      </Suspense>
    </>
  )
}
