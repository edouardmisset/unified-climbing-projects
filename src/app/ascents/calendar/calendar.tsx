'use client'

import { DataCalendar } from '~/app/_components/data-calendar/data-calendar'
import { renderAscentDay } from '~/app/_components/data-calendar/renders'
import type { Ascent } from '~/schema/ascent'

export function AscentCalendar({
  allAscents,
  year,
}: {
  allAscents: Ascent[] | Promise<Ascent[]>
  year: number
}) {
  return (
    <>
      <h2 className="centerText">{year}</h2>
      <DataCalendar<Ascent>
        data={allAscents}
        key={year}
        transformDay={renderAscentDay}
        year={year}
      />
    </>
  )
}
