import { convertGradeToColor } from '~/helpers/converter'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { type Ascent } from '~/types/ascent'

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
            weeklyAscents.length === 1 ?
              convertGradeToColor(weeklyAscents[0]!.topoGrade)
            : `linear-gradient(${weeklyAscents
                .map(ascent => convertGradeToColor(ascent.topoGrade))
                .join(', ')})`

          return (
            <span
              key={i}
              style={{
                display: 'block',
                height: '100%',
                width: barWidth,
                maxWidth: maxBarWidth,
                background: backgroundGradient,
              }}
              title={createBarTooltip(weeklyAscents)}
            />
          )
        })}
      </div>
    </div>
  )
}

const createBarTooltip = (ascents: Ascent[]): string =>
  ascents.length >= 1 ?
    `Week # ${ascents[0]!.date.weekOfYear.toString()}
Routes (${ascents.length}):
${ascents
  .map(
    ({ routeName, topoGrade, climbingDiscipline, crag }) =>
      `${climbingDiscipline === 'Boulder' ? '🪨' : ''}${
        climbingDiscipline === 'Route' ? '🧗' : ''
      } ${routeName} (${crag}) - ${topoGrade}`,
  )
  .join('\n')}`
  : ''
