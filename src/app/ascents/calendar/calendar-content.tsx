import { filterByDate } from '@edouardmisset/array'
import NotFound from '~/app/not-found'
import { createYearList } from '~/data/helpers'
import { getAllAscents } from '~/services/ascents'
import { AscentCalendar } from './calendar'

export async function CalendarContent() {
  const allAscents = await getAllAscents()

  if (!allAscents) return <NotFound />

  const ascentYearsData = createYearList(allAscents, {
    continuous: false,
    descending: true,
  }).map(year => [year, allAscents.filter(filterByDate('date', { year }))] as const)

  return (
    <>
      {ascentYearsData.map(([year, ascents]) => (
        <AscentCalendar allAscents={ascents} key={year} year={year} />
      ))}
    </>
  )
}
