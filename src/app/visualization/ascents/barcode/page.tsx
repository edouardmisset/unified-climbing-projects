import type { Metadata } from 'next'
import { lazy, Suspense } from 'react'
import { Dialog } from '~/app/_components/dialog/dialog'
import { Loader } from '~/app/_components/loader/loader'
import NotFound from '~/app/not-found'
import { groupDataWeeksByYear } from '~/data/helpers'
import { api } from '~/trpc/server'

// LAZY LOADING: Load barcode component only when needed
const AscentsBarcode = lazy(() =>
  import('~/app/_components/barcode/barcode').then(module => ({
    default: module.AscentsBarcode,
  })),
)

export default async function AscentBarcodePage() {
  const allAscents = await api.ascents.getAll()

  if (!allAscents) return <NotFound />

  const groupedAscentsWeekly = groupDataWeeksByYear(allAscents)

  return Object.entries(groupedAscentsWeekly)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearAscents]) => (
      <div className="flexColumn w100" key={year}>
        <h2 className="centerText">
          <Dialog
            content={
              <Suspense fallback={<Loader />}>
                <AscentsBarcode yearlyAscents={yearAscents} />
              </Suspense>
            }
            title={year}
          />
        </h2>
        <Suspense fallback={<Loader />}>
          <AscentsBarcode yearlyAscents={yearAscents} />
        </Suspense>
      </div>
    ))
}

export const metadata: Metadata = {
  description: 'Barcode visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'barcode'],
  title: 'Ascents Barcode Visualization 🖼️',
}
