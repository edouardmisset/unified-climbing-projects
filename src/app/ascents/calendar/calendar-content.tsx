import { filterByDate } from '@edouardmisset/array'
import NotFound from '~/app/not-found'
import { createYearList } from '~/data/helpers'
import { getAllAscents } from '~/services/ascents'
import { AscentCalendar } from './calendar'

export async function CalendarContent() {
  const allAscents = await getAllAscents()

  if (allAscents.length === 0) return <NotFound />

  const ascentYearsData = createYearList(allAscents, {
    continuous: false,
    descending: true,
  }).map(
    year =>
      [
        year,
        filterByDate({
          array: allAscents,
          keyOrFunction: 'date',
          options: { year },
        }).data ?? [],
      ] as const,
  )

  return (
    <>
      {ascentYearsData.map(([year, ascents], index) => (
        <AscentCalendar allAscents={ascents} isLatestYear={index === 0} key={year} year={year} />
      ))}
    </>
  )
}
