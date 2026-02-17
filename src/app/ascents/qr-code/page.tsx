import type { Metadata } from 'next'
import { lazy, Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import NotFound from '~/app/not-found'
import { groupDataDaysByYear } from '~/data/helpers'
import { sortByGrade } from '~/helpers/sorter'
import { getAllAscents } from '~/services/ascents'

// LAZY LOADING: Load QR code component only when needed
const AscentsQRCode = lazy(() =>
  import('~/app/_components/qr-code/qr-code').then(module => ({
    default: module.AscentsQRCode,
  })),
)

export default async function AscentsQRCodePage() {
  const allAscents = await getAllAscents()

  if (!allAscents) return <NotFound />

  const groupedAscentsDaily = groupDataDaysByYear(allAscents)

  return (
    <Layout title='Ascents QR'>
      {Object.entries(groupedAscentsDaily)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, yearlyAscents]) => {
          if (yearlyAscents === undefined)
            return <span key='unexpected-error'>Unexpected error</span>
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
        })}
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'QR Code visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'qr code'],
  title: 'Ascents QR Code Visualization 🖼️',
}
