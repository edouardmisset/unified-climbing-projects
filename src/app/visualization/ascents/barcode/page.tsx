import type { Metadata } from 'next'
import { AscentsBarcode } from '~/app/_components/barcode/barcode'
import { Dialog } from '~/app/_components/dialog/dialog'
import NotFound from '~/app/not-found'
import { groupDataWeeksByYear } from '~/data/helpers'
import { api } from '~/trpc/server'

export default async function AscentBarcodePage() {
  const allAscents = await api.ascents.getAll()

  if (!allAscents) return <NotFound />

  const groupedAscentsWeekly = groupDataWeeksByYear(allAscents)

  return Object.entries(groupedAscentsWeekly)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearAscents]) => (
      <div className="flex-column w100" key={year}>
        <h2 className="center-text">
          <Dialog
            content={<AscentsBarcode yearlyAscents={yearAscents} />}
            title={year}
          />
        </h2>
        <AscentsBarcode yearlyAscents={yearAscents} />
      </div>
    ))
}

export const metadata: Metadata = {
  description: 'Barcode visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'barcode'],
  title: 'Ascents Barcode Visualization 🖼️',
}
