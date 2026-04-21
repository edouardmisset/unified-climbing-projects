import type { DayDescriptor } from '~/shared/components/year-grid/year-grid'
import { fromGradeToBackgroundColor } from '~/ascents/helpers/ascent-converter'
import { getHardestAscent } from '~/ascents/helpers/filter-ascents'
import type { Ascent } from '~/ascents/schema'
import { formatGrade } from './format-grade'
import { formatShortDate, prettyLongDate } from '~/shared/helpers/formatters'
import { NOON_HOUR } from '~/shared/constants/generic'

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

      const { date, crag, climbingDiscipline } = firstAscent
      const hardestInGroup = getHardestAscent(ascents)
      const topoGrade = hardestInGroup?.topoGrade ?? firstAscent.topoGrade
      const backgroundColor = fromGradeToBackgroundColor(topoGrade)
      const dateAndCrag = `${prettyLongDate(date)} - ${crag}`

      return {
        backgroundColor,
        date,
        isSpecialCase: ascents.every(ascent => ascent.climbingDiscipline === 'Boulder'),
        shortText: formatGrade({ climbingDiscipline, grade: topoGrade }),
        title: dateAndCrag,
        ascents,
      }
    }) ?? []
  )
}
