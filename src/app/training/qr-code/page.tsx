import { Link } from 'next-view-transitions'
import GridLayout from '~/app/_components/grid-layout/grid-layout.tsx'
import QRCode from '~/app/_components/qr-code/qr-code'
import { getYearTraining } from '~/data/training-data'
import { api } from '~/trpc/server'
import { trainingSessionsQRCodeRender } from './helpers.tsx'

export default async function Page() {
  const trainingSessions = await api.training.getAllTrainingSessions()
  return (
    <GridLayout title="Training">
      {Object.entries(getYearTraining(trainingSessions))
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, training]) => (
          <div key={year}>
            <h2 className="center-text">
              <Link href={`/training/qr-code/${year}`}>{year}</Link>
            </h2>
            <QRCode data={training} itemRender={trainingSessionsQRCodeRender} />
          </div>
        ))}
    </GridLayout>
  )
}
