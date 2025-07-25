import { AscentsPopoverDescription } from '~/app/_components/ascents-popover-description/ascents-popover-description'
import type { DayDescriptor } from '~/app/_components/year-grid/year-grid'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import type { Ascent } from '~/schema/ascent'
import { formatDateTime } from './format-date'
import { formatGrade } from './format-grade'
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
          description: '',
          shortText: '',
          title: formatDateTime(new Date(date), 'shortDate'),
        }
      }

      const { date, crag, climbingDiscipline } = firstAscent
      const { topoGrade } = getHardestAscent(ascents)
      const backgroundColor = fromGradeToBackgroundColor(topoGrade)
      const dateAndCrag = `${prettyLongDate(date)} - ${crag}`

      return {
        backgroundColor,
        date,
        description: <AscentsPopoverDescription ascents={ascents} />,
        isSpecialCase: ascents.every(
          ascent => ascent.climbingDiscipline === 'Boulder',
        ),
        shortText: formatGrade({ climbingDiscipline, grade: topoGrade }),
        title: dateAndCrag,
      }
    }) ?? []
  )
}
