import type { DayDescriptor } from '~/app/_components/year-grid/year-grid'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { type Ascent, BOULDERING } from '~/schema/ascent'
import { formatGrade } from './format-grade'
import { formatShortDate, prettyLongDate } from './formatters'

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
          title: formatShortDate(date),
        }
      }

      const { date, crag, discipline } = firstAscent
      const { grade } = getHardestAscent(ascents)
      const backgroundColor = fromGradeToBackgroundColor(grade)
      const dateAndCrag = `${prettyLongDate(date)} - ${crag}`

      return {
        backgroundColor,
        date,
        isSpecialCase: ascents.every(
          ascent => ascent.discipline === BOULDERING,
        ),
        shortText: formatGrade({
          discipline,
          grade,
        }),
        title: dateAndCrag,
        ascents,
      }
    }) ?? []
  )
}
