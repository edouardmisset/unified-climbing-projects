import { Link } from 'next-view-transitions'
import Barcode from '~/app/_components/barcode/barcode'
import { createYearList, getYearsAscentsPerWeek } from '~/data/ascent-data'
import { api } from '~/trpc/server'
import { ascentsBarcodeRender } from './helpers.tsx'

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
      {Object.values(getYearsAscentsPerWeek(ascents))
        .map((yearAscents, i) => {
          const yearList = createYearList(ascents)
          const year = yearList[yearList.length - 1 - i]?.toString() ?? ''
          return (
            <div key={year} className="flex-column w100">
              <h1 className="center-text">
                <Link href={`/ascents/barcode/${year}`}>{year}</Link>
              </h1>
              <Barcode data={yearAscents} itemRender={ascentsBarcodeRender} />
            </div>
          )
        })
        .reverse()}
    </div>
  )
}
