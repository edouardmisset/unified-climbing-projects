import type { Metadata } from 'next'
import { lazy, Suspense } from 'react'
import { Loader } from '~/shared/components/ui/loader/loader'
import Layout from '~/shared/components/page-layout/page-layout'
import NotFound from '~/app/not-found'
import { groupDataWeeksByYear } from '~/shared/data/helpers'
import { getAllAscents } from '~/ascents/services'

// LAZY LOADING: Load barcode component only when needed
const AscentsBarcode = lazy(async () =>
  import('~/shared/components/barcode/barcode').then(module => ({
    default: module.AscentsBarcode,
  })),
)

export default async function AscentBarcodePage() {
  const allAscents = await getAllAscents()

  if (!allAscents) return <NotFound />

  const groupedAscentsWeekly = groupDataWeeksByYear(allAscents)

  return (
    <Layout title='Ascents Barcode'>
      {Object.entries(groupedAscentsWeekly)
        .toSorted(([a], [b]) => Number(b) - Number(a))
        .map(([year, yearAscents]) => (
          <div className='flexColumn w100' key={year}>
            <h2 className='centerText'>{year}</h2>
            <Suspense fallback={<Loader />}>
              <AscentsBarcode yearlyAscents={yearAscents} />
            </Suspense>
          </div>
        ))}
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Barcode visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'barcode'],
  title: 'Ascents Barcode Visualization 🖼️',
}
