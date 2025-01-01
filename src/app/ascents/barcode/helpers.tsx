import { maxBarWidth } from '~/app/_components/barcode/constants'
import {
  fromGradeToBackgroundColor,
  fromGradeToClassName,
} from '~/helpers/converter'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { createAscentBarCodeTooltip } from '~/helpers/tooltips'
import type { Ascent } from '~/schema/ascent'
import type { StringDateTime } from '~/types/generic'

export function ascentsBarcodeRender(
  weeklyAscents: ((StringDateTime & Ascent) | undefined)[],
  index: number,
) {
  const barWidth = weeklyAscents.length

  const filteredWeeklyAscents = weeklyAscents.filter(
    ascent => ascent !== undefined,
  )

  const sortedFilteredWeeklyAscents = filteredWeeklyAscents.toSorted((a, b) =>
    sortByDescendingGrade(a, b),
  )

  // Colorize bars
  const isSingleAscent = weeklyAscents.length === 1
  const backgroundGradient = `linear-gradient(${sortedFilteredWeeklyAscents
    .map(ascent => fromGradeToBackgroundColor(ascent.topoGrade))
    .join(', ')})`

  return (
    <span
      key={(weeklyAscents[0]?.date ?? index).toString()}
      className={`bar ${
        isSingleAscent ? fromGradeToClassName(weeklyAscents[0]?.topoGrade) : ''
      }`}
      style={{
        inlineSize: barWidth,
        maxInlineSize: maxBarWidth,
        background: isSingleAscent ? undefined : backgroundGradient,
      }}
      title={createAscentBarCodeTooltip(sortedFilteredWeeklyAscents)}
    />
  )
}
