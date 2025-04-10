import { Suspense } from 'react'
import { Dialog } from '~/app/_components/dialog/dialog'
import { Loader } from '~/app/_components/loader/loader'
import QRCode from '~/app/_components/qr-code/qr-code'
import { TrainingsQRDot } from '~/app/_components/qr-code/trainings-qr-dot'
import NotFound from '~/app/not-found'
import { groupDataDaysByYear } from '~/data/helpers'
import { api } from '~/trpc/server'

export default async function TrainingSessionsQRCodePage() {
  const trainingSessions = await api.training.getAllTrainingSessions()

  if (!trainingSessions) return <NotFound />

  const groupedTrainingDaily = groupDataDaysByYear(trainingSessions)

  return (
    <Suspense fallback={<Loader />}>
      {Object.entries(groupedTrainingDaily)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, yearlyTraining]) => (
          <div key={year}>
            <h2 className="center-text">
              <Dialog
                title={year}
                content={
                  <QRCode>
                    {yearlyTraining.map((trainingSessions, index) => {
                      const [firstTraining] = trainingSessions
                      return (
                        <TrainingsQRDot
                          trainingSessions={trainingSessions}
                          key={firstTraining?.date ?? index}
                        />
                      )
                    })}
                  </QRCode>
                }
              />
            </h2>
            <QRCode>
              {yearlyTraining.map((trainingSessions, index) => {
                const [firstTraining] = trainingSessions
                return (
                  <TrainingsQRDot
                    trainingSessions={trainingSessions}
                    key={firstTraining?.date ?? index}
                  />
                )
              })}
            </QRCode>
          </div>
        ))}
    </Suspense>
  )
}

export const metadata = {
  title: 'Training Sessions QR Code Visualization 🖼️',
  description: 'QR Code visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'qr code'],
}
