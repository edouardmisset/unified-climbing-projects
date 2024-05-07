import Barcode from '~/app/_components/barcode/barcode'
import { seasonsAscentsPerWeek } from '~/data/ascent-data'

export default function Page({
  params: { year },
}: {
  params: { year: string }
}) {
  const seasonAscents = seasonsAscentsPerWeek[year]

  if (seasonAscents === undefined) return <span>No Data</span>

  return (
    <main>
      <h3 style={{ textAlign: 'center' }}>{year}</h3>
      <Barcode key={year} seasonAscents={seasonAscents} />
    </main>
  )
}
