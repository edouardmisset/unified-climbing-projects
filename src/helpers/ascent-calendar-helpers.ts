import type { DayDescriptor } from '~/app/_components/year-grid/year-grid'
import { fromGradeToBackgroundColor } from '~/helpers/converter'
import { formatDateTime } from '~/helpers/date'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { createAscentsQRTooltip } from '~/helpers/tooltips'
import type { Ascent } from '~/schema/ascent'

export function fromAscentsToCalendarEntries(
  year: number,
  ascentsArray?: Ascent[][],
): DayDescriptor[] {
  return (
    ascentsArray?.map((ascents, index) => {
      const firstAscent = ascents[0]

      if (firstAscent === undefined || ascents === undefined) {
        const date = new Date(year, 0, index + 1, 12).toISOString()
        return {
          date,
          shortText: '',
          tooltip: formatDateTime(new Date(date), 'shortDate'),
        }
      }

      const { date } = firstAscent
      const { topoGrade } = getHardestAscent(ascents)
      const backgroundColor = fromGradeToBackgroundColor(topoGrade)
      return {
        date,
        backgroundColor,
        tooltip: createAscentsQRTooltip(ascents),
        shortText: topoGrade,
      }
    }) ?? []
  )
}
