import QRCode from '~/app/_components/qr-code/qr-code'
import { getSeasonTraining } from '~/data/training-data'
import { convertSessionTypeToBackgroundColor } from '~/helpers/converter'
import { createTrainingQRTooltip } from '~/helpers/tooltips'
import { api } from '~/trpc/server'
import type { TrainingSession } from '~/types/training'

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const { year } = await props.params

  const trainingSessions = await api.training.getAllTrainingSessions()

  const selectedTrainingSessions =
    getSeasonTraining(trainingSessions)[Number(year)]

  if (selectedTrainingSessions === undefined)
    return <div>No data found for the year {year}</div>

  return (
    <main className="flex-column">
      <section className="flex-column">
        <div key={year}>
          <h3 className="section-header">{year}</h3>
          <QRCode
            data={selectedTrainingSessions}
            itemRender={(trainingSession: TrainingSession) => (
              <i
                key={trainingSession.date.dayOfYear}
                style={{
                  backgroundColor: convertSessionTypeToBackgroundColor(
                    trainingSession.sessionType,
                  ).toString(),
                }}
                title={createTrainingQRTooltip(trainingSession)}
              />
            )}
          />
        </div>
      </section>
    </main>
  )
}
