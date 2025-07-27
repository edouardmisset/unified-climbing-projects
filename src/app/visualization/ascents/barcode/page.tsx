import type { Metadata } from 'next'
import { AscentsBar } from '~/app/_components/barcode/ascents-bar'
import { Barcode } from '~/app/_components/barcode/barcode'
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
            content={
              <Barcode>
                {yearAscents.map((ascents, index) => (
                  <AscentsBar
                    key={ascents[0]?.date ?? index}
                    weeklyAscents={ascents}
                  />
                ))}
              </Barcode>
            }
            title={year}
          />
        </h2>
        <Barcode>
          {yearAscents.map((weeklyAscents, index) => (
            <AscentsBar
              key={weeklyAscents[0]?.date ?? index}
              weeklyAscents={weeklyAscents}
            />
          ))}
        </Barcode>
      </div>
    ))
}

export const metadata: Metadata = {
  description: 'Barcode visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'barcode'],
  title: 'Ascents Barcode Visualization 🖼️',
}
