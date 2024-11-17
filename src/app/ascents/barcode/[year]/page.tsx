import Barcode, {
  maxBarWidth,
  minBarWidth,
} from '~/app/_components/barcode/barcode'
import { seasonsAscentsPerWeek } from '~/data/ascent-data'
import { convertGradeToBackgroundColor } from '~/helpers/converter'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { createAscentBarCodeTooltip } from '~/helpers/tooltips'

export default function Page({
  params: { year },
}: {
  params: { year: string }
}) {
  const selectedAscentsPerWeek = seasonsAscentsPerWeek[year]

  if (selectedAscentsPerWeek === undefined)
    return <span>No Data found for this year</span>

  const sortedAscents = [...selectedAscentsPerWeek].map(ascentWeek =>
    ascentWeek
      ?.filter(ascent => ascent !== undefined)
      ?.sort(sortByDescendingGrade),
  )

  return (
    <main>
      <h3 className="section-header">{year}</h3>
      <Barcode
        data={sortedAscents}
        itemRender={(weeklyAscents, index) => {
          if (weeklyAscents === undefined) return <span key={index} />

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
    </main>
  )
}
