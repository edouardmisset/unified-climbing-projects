import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import QRCode from '~/app/_components/qr-code/qr-code'
import { TrainingsQRDot } from '~/app/_components/qr-code/trainings-qr-dot.tsx'
import { groupTrainingDaysByYear } from '~/data/training-data'
import { api } from '~/trpc/server'

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const year = validNumberWithFallback(
    (await props.params).year,
    new Date().getFullYear(),
  )

  const trainingSessions = await api.training.getAllTrainingSessions()

  const selectedTrainingSessions =
    groupTrainingDaysByYear(trainingSessions)[year]

  if (selectedTrainingSessions === undefined)
    return <div>No data found for the year {year}</div>

  return (
    <section className="flex-column w100 h100 align-center">
      <h1 className="section-header">{year}</h1>
      <QRCode>
        {selectedTrainingSessions.map((trainingSessions, index) => (
          <TrainingsQRDot
            trainingSessions={trainingSessions}
            key={trainingSessions[0]?.date ?? index}
          />
        ))}
      </QRCode>
    </section>
  )
}
