import type { DayDescriptor } from '~/app/_components/year-grid/year-grid'
import { fromGradeToBackgroundColor } from '~/helpers/converter'
import { formatDateTime } from '~/helpers/date'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { createAscentsQRTooltip } from '~/helpers/tooltips'
import type { Ascent } from '~/schema/ascent'
import type { StringDateTime } from '~/types/generic'

export function fromAscentsToCalendarEntries(
  yearlyAscents?: (StringDateTime & {
    ascents?: Ascent[]
  })[],
): DayDescriptor[] {
  return (
    yearlyAscents?.map(ascentDay => {
      const { date, ascents } = ascentDay

      if (ascents === undefined)
        return {
          date,
          shortText: '',
          tooltip: formatDateTime(new Date(date), 'shortDate'),
        }

      const hardestAscent = getHardestAscent(ascents)

      const backgroundColor = fromGradeToBackgroundColor(
        hardestAscent.topoGrade,
      )
      return {
        date,
        backgroundColor,
        tooltip: createAscentsQRTooltip(ascentDay.ascents),
        shortText: hardestAscent.topoGrade,
      }
    }) ?? []
  )
}
