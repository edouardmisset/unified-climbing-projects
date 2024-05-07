import Link from 'next/link'
import Barcode from '~/app/_components/barcode/barcode'
import { ascentSeasons, seasonsAscentsPerWeek } from '~/data/ascent-data'

export default function Page() {
  return (
    <main
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1rem',
      }}
    >
      {Object.values(seasonsAscentsPerWeek)
        .map((seasonAscents, i) => {
          const year =
            ascentSeasons[ascentSeasons.length - 1 - i]?.toString() ?? ''
          return (
            <div key={year} className="flex-column" style={{}}>
              <h3 style={{ textAlign: 'center' }}>
                <Link href={`/barcode/ascents/${year}`}>{year}</Link>
              </h3>
              <Barcode seasonAscents={seasonAscents} />
            </div>
          )
        })
        .reverse()}
    </main>
  )
}
