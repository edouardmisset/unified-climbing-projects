import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import QRCode from '~/app/_components/qr-code/qr-code'
import { getYearTraining } from '~/data/training-data'
import { api } from '~/trpc/server'
import { trainingSessionsQRCodeRender } from '../../../../helpers/training-qr-code-helpers.tsx'

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const year = validNumberWithFallback(
    (await props.params).year,
    new Date().getFullYear(),
  )

  const trainingSessions = await api.training.getAllTrainingSessions()

  const selectedTrainingSessions = getYearTraining(trainingSessions)[year]

  if (selectedTrainingSessions === undefined)
    return <div>No data found for the year {year}</div>

  return (
    <section className="flex-column w100">
      <h1 className="section-header">{year}</h1>
      <QRCode
        allData={selectedTrainingSessions}
        dotRender={trainingSessionsQRCodeRender}
      />
    </section>
  )
}
