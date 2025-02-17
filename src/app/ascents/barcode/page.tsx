import { Link } from 'next-view-transitions'
import Barcode from '~/app/_components/barcode/barcode'
import GridLayout from '~/app/_components/grid-layout/grid-layout.tsx'
import { getYearsAscentsPerWeek } from '~/data/ascent-data'
import { api } from '~/trpc/server'
import { AscentsBars } from '../../_components/barcode/ascents-bars.tsx'

export default async function Page() {
  return (
    <GridLayout title="Ascents">
      <BarcodeByYear />
    </GridLayout>
  )
}

async function BarcodeByYear() {
  const ascents = await api.ascents.getAllAscents()

  return Object.entries(getYearsAscentsPerWeek(ascents))
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearAscents]) => (
      <div key={year} className="flex-column w100">
        <h2 className="center-text">
          <Link href={`/ascents/barcode/${year}`} prefetch={true}>
            {year}
          </Link>
        </h2>
        <Barcode>
          {yearAscents.map(weeklyAscents => (
            <AscentsBars
              key={weeklyAscents[0]?.date}
              weeklyAscents={weeklyAscents}
            />
          ))}
        </Barcode>
      </div>
    ))
}
