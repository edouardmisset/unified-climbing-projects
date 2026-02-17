import type { Metadata } from 'next'
import { lazy, Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import NotFound from '~/app/not-found'
import { groupDataWeeksByYear } from '~/data/helpers'
import { getAllAscents } from '~/services/ascents'

// LAZY LOADING: Load barcode component only when needed
const AscentsBarcode = lazy(() =>
  import('~/app/_components/barcode/barcode').then(module => ({
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
        .sort(([a], [b]) => Number(b) - Number(a))
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
