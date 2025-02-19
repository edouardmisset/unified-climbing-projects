import { Link } from 'next-view-transitions'
import GridLayout from '~/app/_components/grid-layout/grid-layout.tsx'
import QRCode from '~/app/_components/qr-code/qr-code'
import { TrainingsQRDot } from '~/app/_components/qr-code/trainings-qr-dot.tsx'
import { groupDataDaysByYear } from '~/data/helpers'
import { api } from '~/trpc/server'

export default async function Page() {
  const trainingSessions = await api.training.getAllTrainingSessions()
  return (
    <GridLayout title="Training">
      {Object.entries(groupDataDaysByYear(trainingSessions))
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, yearlyTraining]) => (
          <div key={year}>
            <h2 className="center-text">
              <Link href={`/training/qr-code/${year}`} prefetch={true}>
                {year}
              </Link>
            </h2>
            <QRCode>
              {yearlyTraining.map((trainingSessions, index) => (
                <TrainingsQRDot
                  trainingSessions={trainingSessions}
                  key={trainingSessions[0]?.date ?? index}
                />
              ))}
            </QRCode>
          </div>
        ))}
    </GridLayout>
  )
}
