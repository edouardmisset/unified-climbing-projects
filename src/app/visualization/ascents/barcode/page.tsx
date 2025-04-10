import { Suspense } from 'react'
import { AscentsBar } from '~/app/_components/barcode/ascents-bar'
import { Barcode } from '~/app/_components/barcode/barcode'
import { Dialog } from '~/app/_components/dialog/dialog'
import { Loader } from '~/app/_components/loader/loader'
import NotFound from '~/app/not-found'
import { groupDataWeeksByYear } from '~/data/helpers'
import { api } from '~/trpc/server'

export default async function AscentBarcodePage() {
  const allAscents = await api.ascents.getAll()

  if (!allAscents) return <NotFound />

  const groupedAscentsWeekly = groupDataWeeksByYear(allAscents)

  return (
    <Suspense fallback={<Loader />}>
      {Object.entries(groupedAscentsWeekly)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, yearAscents]) => (
          <div key={year} className="flex-column w100">
            <h2 className="center-text">
              <Dialog
                title={year}
                content={
                  <Barcode>
                    {yearAscents.map((ascents, index) => {
                      const [firstAscent] = ascents
                      return (
                        <AscentsBar
                          key={firstAscent?.date ?? index}
                          weeklyAscents={ascents}
                        />
                      )
                    })}
                  </Barcode>
                }
              />
            </h2>
            <Barcode>
              {yearAscents.map((weeklyAscents, index) => {
                const [firstAscentOfTheWeek] = weeklyAscents
                return (
                  <AscentsBar
                    key={firstAscentOfTheWeek?.date ?? index}
                    weeklyAscents={weeklyAscents}
                  />
                )
              })}
            </Barcode>
          </div>
        ))}
    </Suspense>
  )
}

export const metadata = {
  title: 'Ascents Barcode Visualization 🖼️',
  description: 'Barcode visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'barcode'],
}
