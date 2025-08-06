import type { Metadata } from 'next'
import { lazy, Suspense } from 'react'
import { Dialog } from '~/app/_components/dialog/dialog'
import { Loader } from '~/app/_components/loader/loader'
import NotFound from '~/app/not-found'
import { groupDataDaysByYear } from '~/data/helpers'
import { sortByGrade } from '~/helpers/sorter'
import { api } from '~/trpc/server'

// LAZY LOADING: Load QR code component only when needed
const AscentsQRCode = lazy(() =>
  import('~/app/_components/qr-code/qr-code').then(module => ({
    default: module.AscentsQRCode,
  })),
)

export default async function AscentsQRCodePage() {
  const allAscents = await api.ascents.getAll()

  if (!allAscents) return <NotFound />

  const groupedAscentsDaily = groupDataDaysByYear(allAscents)

  return Object.entries(groupedAscentsDaily)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearlyAscents]) => {
      if (yearlyAscents === undefined)
        return <span key="unexpected-error">Unexpected error</span>
      const sortedAscents = yearlyAscents.map(ascents =>
        ascents.toSorted((a, b) => sortByGrade(a, b)),
      )
      return (
        <div className="flexColumn alignCenter" key={year}>
          <h2 className="centerText">
            <Dialog
              content={
                <Suspense fallback={<Loader />}>
                  <AscentsQRCode yearlyAscents={sortedAscents} />
                </Suspense>
              }
              title={year}
            />
          </h2>
          <Suspense fallback={<Loader />}>
            <AscentsQRCode yearlyAscents={sortedAscents} />
          </Suspense>
        </div>
      )
    })
}

export const metadata: Metadata = {
  description: 'QR Code visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'qr code'],
  title: 'Ascents QR Code Visualization 🖼️',
}
