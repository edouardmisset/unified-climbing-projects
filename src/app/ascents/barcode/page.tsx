import { Link } from 'next-view-transitions'
import { AscentsBar } from '~/app/_components/barcode/ascents-bar.tsx'
import Barcode from '~/app/_components/barcode/barcode'
import GridLayout from '~/app/_components/grid-layout/grid-layout.tsx'
import { getYearsAscentsPerWeek } from '~/data/ascent-data'
import { api } from '~/trpc/server'

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
          {yearAscents.map((weeklyAscents, index) => (
            <AscentsBar
              key={weeklyAscents[0]?.date ?? index}
              weeklyAscents={weeklyAscents}
            />
          ))}
        </Barcode>
      </div>
    ))
}
