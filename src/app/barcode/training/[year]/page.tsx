import { seasonsTrainingPerWeek } from '~/data/training-data'
import { convertSessionTypeToColor } from '~/helpers/colors'
import { convertSessionTypeToSortOrder } from '~/helpers/sorter'

export default function Page({
  params: { year },
}: {
  params: { year: string }
}) {
  const selectedTraining = seasonsTrainingPerWeek[year]

  if (selectedTraining === undefined) return <span>No Data</span>

  return (
    <main>
      <div
        style={{
          height: 400,
          width: 600,
          background: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 4,

          padding: 'clamp(.5rem, 5cqi, 2rem)',
          margin: 'auto',
        }}
      >
        {selectedTraining.map((week, i) => {
          const barWidth =
            Math.min(
              week.reduce((acc, s) => acc + (s?.load ?? 100) / 100, 0),
              3,
            ) * 4

          // Sort week's sessions by there types
          week.sort(({ sessionType: aType }, { sessionType: bType }) => {
            if (aType === undefined || bType === undefined) return 0

            return (
              convertSessionTypeToSortOrder(bType) -
              convertSessionTypeToSortOrder(aType)
            )
          })

          const backgroundGradient =
            week.length === 1 ?
              convertSessionTypeToColor(week[0]!.sessionType!)
            : `linear-gradient(${week
                .map(session => convertSessionTypeToColor(session.sessionType!))
                .join(', ')})`

          const firstDate = week?.[0]?.date
          return (
            <span
              key={i}
              style={{
                display: 'block',
                height: '100%',
                width: barWidth,
                background: backgroundGradient,
              }}
              title={
                firstDate === undefined ? '' : (
                  `Week # ${firstDate.weekOfYear.toString()}`
                )
              }
            />
          )
        })}
      </div>
    </main>
  )
}
