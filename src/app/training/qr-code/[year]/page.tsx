import QRCode from '~/app/_components/qr-code/qr-code'
import { getYearTraining } from '~/data/training-data'
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
    getYearTraining(trainingSessions)[Number(year)]

  if (selectedTrainingSessions === undefined)
    return <div>No data found for the year {year}</div>

  return (
    <section className="flex-column w100">
      <h1 className="section-header">{year}</h1>
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
    </section>
  )
}
