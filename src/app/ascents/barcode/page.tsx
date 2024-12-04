import Link from 'next/link'
import Barcode, { maxBarWidth } from '~/app/_components/barcode/barcode'
import { createSeasons, getSeasonsAscentsPerWeek } from '~/data/ascent-data'
import { convertGradeToBackgroundColor } from '~/helpers/converter'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { createAscentBarCodeTooltip } from '~/helpers/tooltips'
import { api } from '~/trpc/server'

export default async function Page() {
  const ascents = await api.ascents.getAllAscents()
  return (
    <div
      style={{
        inlineSize: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1rem',
      }}
    >
      {Object.values(getSeasonsAscentsPerWeek(ascents))
        .map((seasonAscents, i) => {
          const seasons = createSeasons(ascents)
          const year = seasons[seasons.length - 1 - i]?.toString() ?? ''
          return (
            <div key={year} className="flex-column w100">
              <h1 className="center-text">
                <Link href={`/ascents/barcode/${year}`}>{year}</Link>
              </h1>
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
                        blockSize: '100%',
                        inlineSize: barWidth,
                        maxInlineSize: maxBarWidth,
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
    </div>
  )
}
