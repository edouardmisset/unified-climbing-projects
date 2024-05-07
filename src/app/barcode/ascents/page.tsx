import Barcode from '~/app/_components/barcode/barcode'
import { ascentSeasons, seasonsAscentsPerWeek } from '~/data/ascent-data'

export default function Page() {
  return (
    <main
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1rem',
      }}
    >
      {Object.values(seasonsAscentsPerWeek)
        .map((seasonAscents, i) => {
          const currentSeason =
            ascentSeasons[ascentSeasons.length - 1 - i]?.toString() ?? ''
          return (
            <Barcode
              key={currentSeason}
              seasonAscents={seasonAscents}
              label={currentSeason}
            />
          )
        })
        .reverse()}
    </main>
  )
}
