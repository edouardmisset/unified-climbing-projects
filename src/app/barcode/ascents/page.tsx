import Link from 'next/link'
import Barcode, { maxBarWidth } from '~/app/_components/barcode/barcode'
import { ascentSeasons, seasonsAscentsPerWeek } from '~/data/ascent-data'
import { convertGradeToBackgroundColor } from '~/helpers/converter'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { createAscentBarCodeTooltip } from '~/helpers/tooltips'

export default function Page() {
  return (
    <main
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1rem',
      }}
    >
      {Object.values(seasonsAscentsPerWeek)
        .map((seasonAscents, i) => {
          const year =
            ascentSeasons[ascentSeasons.length - 1 - i]?.toString() ?? ''
          return (
            <div key={year} className="flex-column" style={{}}>
              <h3 style={{ textAlign: 'center' }}>
                <Link href={`/barcode/ascents/${year}`}>{year}</Link>
              </h3>
              <Barcode
                data={seasonAscents}
                itemRender={(weeklyAscents, index) => {
                  const barWidth = weeklyAscents.length

                  // Sort week's ascents by ascending grades
                  const filteredWeeklyAscents = weeklyAscents.filter(
                    ascent => ascent !== undefined,
                  )

                  filteredWeeklyAscents.sort(
                    (a, b) => -1 * sortByDescendingGrade(a, b),
                  )

                  // Colorize bars
                  const backgroundGradient =
                    weeklyAscents.length === 1
                      ? convertGradeToBackgroundColor(
                          weeklyAscents[0]?.topoGrade,
                        )
                      : `linear-gradient(${filteredWeeklyAscents
                          .map(ascent =>
                            convertGradeToBackgroundColor(ascent.topoGrade),
                          )
                          .join(', ')})`

                  return (
                    <span
                      key={(weeklyAscents[0]?.date ?? index).toString()}
                      style={{
                        display: 'block',
                        height: '100%',
                        width: barWidth,
                        maxWidth: maxBarWidth,
                        background: backgroundGradient,
                      }}
                      title={createAscentBarCodeTooltip(filteredWeeklyAscents)}
                    />
                  )
                }}
              />
            </div>
          )
        })
        .reverse()}
    </main>
  )
}
