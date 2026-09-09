import { filterByDate } from '@edouardmisset/array'
import { CalendarLegend } from '~/app/_components/data-calendar/calendar-legend'
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
      <CalendarLegend
        items={[
          { color: 'var(--6a)', label: '6a' },
          { color: 'var(--6c)', label: '6c' },
          { color: 'var(--7a)', label: '7a' },
          { color: 'var(--7c)', label: '7c' },
          { color: 'var(--8a)', label: '8a' },
          { color: 'var(--8c)', label: '8c+' },
        ]}
        note='Cell labels show the hardest ascent; dashed outlines mark bouldering-only days.'
      />
    </>
  )
}
