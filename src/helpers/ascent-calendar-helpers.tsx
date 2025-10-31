import type { DayDescriptor } from '~/app/_components/year-grid/year-grid'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import type { Ascent } from '~/schema/ascent'
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

      const { date, crag, discipline: climbingDiscipline } = firstAscent
      const { grade: topoGrade } = getHardestAscent(ascents)
      const backgroundColor = fromGradeToBackgroundColor(topoGrade)
      const dateAndCrag = `${prettyLongDate(date)} - ${crag}`

      return {
        backgroundColor,
        date,
        isSpecialCase: ascents.every(
          ascent => ascent.discipline === 'Bouldering',
        ),
        shortText: formatGrade({
          discipline: climbingDiscipline,
          grade: topoGrade,
        }),
        title: dateAndCrag,
        ascents,
      }
    }) ?? []
  )
}
