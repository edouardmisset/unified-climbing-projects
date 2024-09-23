import { convertGradeToBackgroundColor } from '~/helpers/converter'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { createAscentBarCodeTooltip } from '~/helpers/tooltips'
import type { Ascent } from '~/types/ascent'

const minBarWidth = 4
const maxBarWidth = 2.5 * minBarWidth

export default function Barcode({
  seasonAscents,
}: {
  seasonAscents: Ascent[][]
}): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        maxHeight: '100%',
        width: '100%',
      }}
    >
      <div
        style={{
          width: 'clamp(30ch, 50%, 80ch)',
          background: 'white',
          display: 'flex',
          justifyContent: 'space-between',

          gap: minBarWidth,

          padding: `3% ${1.5 * minBarWidth}px 4%`,
          aspectRatio: '3 / 2',
        }}
      >
        {seasonAscents.map((weeklyAscents, i) => {
          const barWidth = weeklyAscents.length

          // Sort week's ascents by ascending grades
          weeklyAscents.sort((a, b) => -1 * sortByDescendingGrade(a, b))

          // Colorize bars
          const backgroundGradient =
            weeklyAscents.length === 1
              ? convertGradeToBackgroundColor(weeklyAscents[0]?.topoGrade)
              : `linear-gradient(${weeklyAscents
                  .map(ascent =>
                    convertGradeToBackgroundColor(ascent.topoGrade),
                  )
                  .join(', ')})`

          return (
            <span
              key={weeklyAscents[0]?.date.toString()}
              style={{
                display: 'block',
                height: '100%',
                width: barWidth,
                maxWidth: maxBarWidth,
                background: backgroundGradient,
              }}
              title={createAscentBarCodeTooltip(weeklyAscents)}
            />
          )
        })}
      </div>
    </div>
  )
}
