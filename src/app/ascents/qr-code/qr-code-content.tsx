import { lazy, Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import NotFound from '~/app/not-found'
import { groupDataDaysByYear } from '~/data/helpers'
import { sortByGrade } from '~/helpers/sorter'
import { getAllAscents } from '~/services/ascents'

const AscentsQRCode = lazy(async () =>
  import('~/app/_components/qr-code/qr-code').then(module => ({
    default: module.AscentsQRCode,
  })),
)

export async function QRCodeContent() {
  const allAscents = await getAllAscents()

  if (allAscents.length === 0) return <NotFound />

  const groupedAscentsDaily = groupDataDaysByYear(allAscents)

  return Object.entries(groupedAscentsDaily)
    .toSorted(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearlyAscents]) => {
      const sortedAscents = yearlyAscents.map(ascents =>
        ascents.toSorted((a, b) => sortByGrade(a, b)),
      )
      return (
        <div className='flexColumn alignCenter' key={year}>
          <h2 className='centerText'>{year}</h2>
          <Suspense fallback={<Loader />}>
            <AscentsQRCode yearlyAscents={sortedAscents} />
          </Suspense>
        </div>
      )
    })
}
