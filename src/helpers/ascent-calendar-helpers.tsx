import { AscentsPopoverDescription } from '~/app/_components/ascents-popover-description/ascents-popover-description'
import type { DayDescriptor } from '~/app/_components/year-grid/year-grid'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { formatDateTime } from '~/helpers/date'
import { getHardestAscent } from '~/helpers/filter-ascents'
import type { Ascent } from '~/schema/ascent'
import { prettyLongDate } from './formatters'

export function fromAscentsToCalendarEntries(
  year: number,
  ascentsArray?: Ascent[][],
): DayDescriptor[] {
  return (
    ascentsArray?.map((ascents, index): DayDescriptor => {
      const [firstAscent] = ascents

      if (firstAscent === undefined || ascents === undefined) {
        const date = new Date(year, 0, index + 1, 12).toISOString()
        return {
          date,
          shortText: '',
          description: '',
          title: formatDateTime(new Date(date), 'shortDate'),
        }
      }

      const { date, crag } = firstAscent
      const { topoGrade } = getHardestAscent(ascents)
      const backgroundColor = fromGradeToBackgroundColor(topoGrade)
      const dateAndCrag = `${prettyLongDate(date)} - ${crag}`

      return {
        date,
        backgroundColor,
        title: dateAndCrag,
        description: <AscentsPopoverDescription ascents={ascents} />,
        shortText: topoGrade,
      }
    }) ?? []
  )
}
