import { getYearsTrainingPerWeek } from '~/data/training-data'
import { convertSessionTypeToBackgroundColor } from '~/helpers/converter'
import { convertSessionTypeToSortOrder } from '~/helpers/sorter'
import { createTrainingBarCodeTooltip } from '~/helpers/tooltips'
import { api } from '~/trpc/server'

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const { year } = await props.params

  const trainingSessions = await api.training.getAllTrainingSessions()

  const selectedTraining = getYearsTrainingPerWeek(trainingSessions)[year]

  if (selectedTraining === undefined) return <span>No Data</span>

  return (
    <section className="w100">
      <h1 className="section-header">{year}</h1>
      <div
        className="flex-row"
        style={{
          maxBlockSize: 400,
          maxInlineSize: 600,
          aspectRatio: '3 / 2',
          background: 'var(--color-light)',
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
                blockSize: '100%',
                inlineSize: barWidth,
                background: backgroundGradient,
              }}
              title={createTrainingBarCodeTooltip(week)}
            />
          )
        })}
      </div>
    </section>
  )
}
