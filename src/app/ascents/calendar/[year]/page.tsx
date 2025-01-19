import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import DataCalendar from '~/app/_components/data-calendar/data-calendar'
import { getYearAscentPerDay } from '~/data/ascent-data'
import { api } from '~/trpc/server'
import { fromAscentsToCalendarEntries } from './helpers'

export default async function AscentCalendar(props: {
  params: Promise<{ year: string }>
}) {
  const year = validNumberWithFallback(
    (await props.params).year,
    new Date().getFullYear(),
  )

  const allAscents = await api.ascents.getAllAscents()

  return (
    <DataCalendar
      year={year}
      data={allAscents}
      dataTransformationFunction={getYearAscentPerDay}
      header="Ascents"
      fromDataToCalendarEntries={fromAscentsToCalendarEntries}
    />
  )
}
