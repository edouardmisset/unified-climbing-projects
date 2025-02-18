import { AscentsBar } from '~/app/_components/barcode/ascents-bar.tsx'
import Barcode from '~/app/_components/barcode/barcode'
import { getYearsAscentsPerWeek } from '~/data/ascent-data'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { api } from '~/trpc/server'

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const { year } = await props.params

  const ascents = await api.ascents.getAllAscents()

  const selectedAscentsPerWeek = getYearsAscentsPerWeek(ascents)[year]

  if (selectedAscentsPerWeek === undefined)
    return <span>No Data found for this year</span>

  const sortedAscents = selectedAscentsPerWeek.map(ascentWeek =>
    ascentWeek
      ?.filter(ascent => ascent !== undefined)
      ?.toSorted((a, b) => sortByDescendingGrade(a, b)),
  )

  return (
    <section className="w100">
      <h1 className="section-header">{year}</h1>
      <Barcode>
        {sortedAscents.map((weeklyAscents, index) => (
          <AscentsBar
            key={weeklyAscents[0]?.date ?? index}
            weeklyAscents={weeklyAscents}
          />
        ))}
      </Barcode>
    </section>
  )
}
