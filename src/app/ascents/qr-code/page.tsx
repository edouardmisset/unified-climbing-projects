import { Link } from 'next-view-transitions'
import GridLayout from '~/app/_components/grid-layout/grid-layout.tsx'
import { AscentsQRDot } from '~/app/_components/qr-code/ascents-qr-dot.tsx'
import QRCode from '~/app/_components/qr-code/qr-code'
import { groupDataDaysByYear } from '~/data/helpers'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { api } from '~/trpc/server'

export default async function Page() {
  const ascents = await api.ascents.getAllAscents()
  return (
    <GridLayout title="Ascents">
      {Object.entries(groupDataDaysByYear(ascents))
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, yearlyAscents]) => {
          if (yearlyAscents === undefined) return <span>Unexpected error </span>

          const sortedAscents = yearlyAscents.map(ascents =>
            ascents.toSorted((a, b) => sortByDescendingGrade(a, b)),
          )
          return (
            <div key={year}>
              <h2 className="center-text">
                <Link href={`/ascents/qr-code/${year}`} prefetch={true}>
                  {year}
                </Link>
              </h2>
              <QRCode>
                {sortedAscents.map((ascents, index) => (
                  <AscentsQRDot
                    ascents={ascents}
                    key={ascents[0]?.date ?? index}
                  />
                ))}
              </QRCode>
            </div>
          )
        })}
    </GridLayout>
  )
}
