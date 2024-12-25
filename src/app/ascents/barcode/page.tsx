import { Link } from 'next-view-transitions'
import Barcode from '~/app/_components/barcode/barcode'
import GridLayout from '~/app/_components/grid-layout/grid-layout.tsx'
import { createYearList, getYearsAscentsPerWeek } from '~/data/ascent-data'
import { api } from '~/trpc/server'
import { ascentsBarcodeRender } from './helpers.tsx'

export default async function Page() {
  const ascents = await api.ascents.getAllAscents({
    descending: true,
  })
  return (
    <GridLayout title="Ascents">
      {Object.values(getYearsAscentsPerWeek(ascents))
        .reverse()
        .map((yearAscents, i) => {
          const yearList = createYearList(ascents)
          const year = yearList[yearList.length - 1 - i]?.toString() ?? ''
          return (
            <div key={year} className="flex-column w100">
              <h2 className="center-text">
                <Link href={`/ascents/barcode/${year}`}>{year}</Link>
              </h2>
              <Barcode data={yearAscents} itemRender={ascentsBarcodeRender} />
            </div>
          )
        })}
    </GridLayout>
  )
}
