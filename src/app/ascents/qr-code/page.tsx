import { Link } from 'next-view-transitions'
import QRCode from '~/app/_components/qr-code/qr-code'
import { getYearAscentPerDay } from '~/data/ascent-data'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { api } from '~/trpc/server'
import { ascentsQRCodeRender } from './helpers.tsx'

export default async function Page() {
  const ascents = await api.ascents.getAllAscents()
  return (
    <section className="flex-column w100">
      <h1 className="center-text">Ascents</h1>
      <div className="grid">
        {Object.entries(getYearAscentPerDay(ascents))
          .reverse()
          .map(([year, ascents]) => {
            const sortedAscents = [...ascents].map(ascentDay => ({
              ...ascentDay,
              ascents: ascentDay?.ascents
                ? ascentDay.ascents.sort(sortByDescendingGrade)
                : undefined,
            }))
            return (
              <div key={`ascents in ${year}`}>
                <h2 className="center-text">
                  <Link href={`/ascents/qr-code/${year}`}>{year}</Link>
                </h2>
                <QRCode data={sortedAscents} itemRender={ascentsQRCodeRender} />
              </div>
            )
          })}
      </div>
    </section>
  )
}
