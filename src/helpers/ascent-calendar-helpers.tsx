import type { DayDescriptor } from '~/app/_components/year-grid/year-grid'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import type { Ascent } from '~/schema/ascent'
import { formatGrade } from './format-grade'
import { formatShortDate, prettyLongDate } from './formatters'
import { NOON_HOUR } from '~/constants/generic'

export function fromAscentsToCalendarEntries(
  year: number,
  ascentsArray?: Ascent[][],
): DayDescriptor[] {
  return (
    ascentsArray?.map((ascents, index): DayDescriptor => {
      const [firstAscent] = ascents

      if (firstAscent === undefined || ascents === undefined) {
        const emptyDate = new Date(year, 0, index + 1, NOON_HOUR).toISOString()
        return {
          date: emptyDate,
          shortText: '',
          title: formatShortDate(emptyDate),
        }
      }

      const { date, crag, discipline } = firstAscent
      const hardestInGroup = getHardestAscent(ascents)
      const grade = hardestInGroup?.grade ?? firstAscent.grade
      const backgroundColor = fromGradeToBackgroundColor(grade)
      const dateAndCrag = `${prettyLongDate(date)} - ${crag}`

      return {
        backgroundColor,
        date,
        isSpecialCase: ascents.every((ascent) => ascent.discipline === 'Bouldering'),
        shortText: formatGrade({ discipline, grade }),
        title: dateAndCrag,
        ascents,
      }
    }) ?? []
  )
}
