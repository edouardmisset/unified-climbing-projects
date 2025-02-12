import Barcode from '~/app/_components/barcode/barcode'
import { getYearsAscentsPerWeek } from '~/data/ascent-data'
import { ascentsBarcodeRender } from '~/helpers/ascents-barcode-helpers'
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
      <Barcode yearData={sortedAscents} barRender={ascentsBarcodeRender} />
    </section>
  )
}
