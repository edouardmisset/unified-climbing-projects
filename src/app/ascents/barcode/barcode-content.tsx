import { lazy, Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import NotFound from '~/app/not-found'
import { groupDataWeeksByYear } from '~/data/helpers'
import { getAllAscents } from '~/services/ascents'

const AscentsBarcode = lazy(async () =>
  import('~/app/_components/barcode/barcode').then(module => ({
    default: module.AscentsBarcode,
  })),
)

export async function BarcodeContent() {
  const allAscents = await getAllAscents()

  if (allAscents.length === 0) return <NotFound />

  const groupedAscentsWeekly = groupDataWeeksByYear(allAscents)

  return Object.entries(groupedAscentsWeekly)
    .toSorted(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearAscents]) => (
      <div className='flexColumn w100' key={year}>
        <h2 className='centerText'>{year}</h2>
        <Suspense fallback={<Loader />}>
          <AscentsBarcode yearlyAscents={yearAscents} />
        </Suspense>
      </div>
    ))
}
