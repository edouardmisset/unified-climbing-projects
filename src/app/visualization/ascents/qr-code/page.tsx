import type { Metadata } from 'next'
import { Dialog } from '~/app/_components/dialog/dialog'
import { AscentsQRDot } from '~/app/_components/qr-code/ascents-qr-dot'
import QRCode from '~/app/_components/qr-code/qr-code'
import NotFound from '~/app/not-found'
import { groupDataDaysByYear } from '~/data/helpers'
import { sortByGrade } from '~/helpers/sorter'
import { api } from '~/trpc/server'

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
        <div key={year}>
          <h2 className="center-text">
            <Dialog
              content={
                <QRCode>
                  {sortedAscents.map((ascents, index) => (
                    <AscentsQRDot
                      ascents={ascents}
                      key={ascents[0]?.date ?? index}
                    />
                  ))}
                </QRCode>
              }
              title={year}
            />
          </h2>
          <QRCode>
            {sortedAscents.map((ascents, index) => (
              <AscentsQRDot ascents={ascents} key={ascents[0]?.date ?? index} />
            ))}
          </QRCode>
        </div>
      )
    })
}

export const metadata: Metadata = {
  description: 'QR Code visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'qr code'],
  title: 'Ascents QR Code Visualization 🖼️',
}
