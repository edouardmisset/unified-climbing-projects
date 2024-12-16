import { maxBarWidth } from '~/app/_components/barcode/barcode'
import { convertGradeToBackgroundColor } from '~/helpers/converter'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { createAscentBarCodeTooltip } from '~/helpers/tooltips'
import type { Ascent } from '~/schema/ascent'
import type { StringDateTime } from '~/types/generic'

export function ascentsBarcodeRender(
  weeklyAscents: ((StringDateTime & Ascent) | undefined)[],
  index: number,
) {
  const barWidth = weeklyAscents.length

  // Sort week's ascents by ascending grades
  const filteredWeeklyAscents = weeklyAscents.filter(
    ascent => ascent !== undefined,
  )

  filteredWeeklyAscents.sort((a, b) => -1 * sortByDescendingGrade(a, b))

  // Colorize bars
  const backgroundGradient =
    weeklyAscents.length === 1
      ? convertGradeToBackgroundColor(weeklyAscents[0]?.topoGrade)
      : `linear-gradient(${filteredWeeklyAscents
          .map(ascent => convertGradeToBackgroundColor(ascent.topoGrade))
          .join(', ')})`

  return (
    <span
      key={(weeklyAscents[0]?.date ?? index).toString()}
      style={{
        display: 'block',
        blockSize: '100%',
        inlineSize: barWidth,
        maxInlineSize: maxBarWidth,
        background: backgroundGradient,
      }}
      title={createAscentBarCodeTooltip(filteredWeeklyAscents)}
    />
  )
}
