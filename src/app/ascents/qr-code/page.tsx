import { Link } from 'next-view-transitions'
import GridLayout from '~/app/_components/grid-layout/grid-layout.tsx'
import QRCode from '~/app/_components/qr-code/qr-code'
import { getYearAscentPerDay } from '~/data/ascent-data'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { api } from '~/trpc/server'
import { ascentsQRCodeRender } from './helpers.tsx'

export default async function Page() {
  const ascents = await api.ascents.getAllAscents()
  return (
    <GridLayout title="Ascents">
      {Object.entries(getYearAscentPerDay(ascents))
        .reverse()
        .map(([year, ascents]) => {
          const sortedAscents = ascents.map(ascentDay => ({
            ...ascentDay,
            ascents: ascentDay?.ascents
              ? ascentDay.ascents.toSorted((a, b) =>
                  sortByDescendingGrade(a, b),
                )
              : undefined,
          }))
          return (
            <div key={year}>
              <h2 className="center-text">
                <Link href={`/ascents/qr-code/${year}`}>{year}</Link>
              </h2>
              <QRCode data={sortedAscents} itemRender={ascentsQRCodeRender} />
            </div>
          )
        })}
    </GridLayout>
  )
}
