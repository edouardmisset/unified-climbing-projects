import { getSeasonsTrainingPerWeek } from '~/data/training-data'
import { convertSessionTypeToBackgroundColor } from '~/helpers/converter'
import { convertSessionTypeToSortOrder } from '~/helpers/sorter'
import { createTrainingBarCodeTooltip } from '~/helpers/tooltips'
import { api } from '~/trpc/server'

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const { year } = await props.params

  const trainingSessions = await api.training.getAllTrainingSessions()

  const selectedTraining = getSeasonsTrainingPerWeek(trainingSessions)[year]

  if (selectedTraining === undefined) return <span>No Data</span>

  return (
    <main>
      <h3 className="section-header">{year}</h3>
      <div
        className="flex-row"
        style={{
          height: 400,
          width: 600,
          background: 'white',
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
            week.length === 1
              ? convertSessionTypeToBackgroundColor(
                  week[0]?.sessionType,
                ).toString()
              : `linear-gradient(${week
                  .map(session =>
                    convertSessionTypeToBackgroundColor(
                      session.sessionType,
                    ).toString(),
                  )
                  .join(', ')})`

          const firstDate = week?.[0]?.date
          return (
            <span
              key={(firstDate ?? i).toString()}
              style={{
                display: 'block',
                height: '100%',
                width: barWidth,
                background: backgroundGradient,
              }}
              title={createTrainingBarCodeTooltip(week)}
            />
          )
        })}
      </div>
    </main>
  )
}
