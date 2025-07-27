import type { Metadata } from 'next'
import { Dialog } from '~/app/_components/dialog/dialog'
import QRCode from '~/app/_components/qr-code/qr-code'
import { TrainingsQRDot } from '~/app/_components/qr-code/trainings-qr-dot'
import NotFound from '~/app/not-found'
import { groupDataDaysByYear } from '~/data/helpers'
import { api } from '~/trpc/server'

export default async function TrainingSessionsQRCodePage() {
  const trainingSessions = await api.training.getAll()

  if (!trainingSessions) return <NotFound />

  const groupedTrainingDaily = groupDataDaysByYear(trainingSessions)

  return Object.entries(groupedTrainingDaily)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearlyTraining]) => (
      <div key={year}>
        <h2 className="center-text">
          <Dialog
            content={
              <QRCode>
                {yearlyTraining.map((trainingSessions, index) => {
                  const [firstTraining] = trainingSessions
                  return (
                    <TrainingsQRDot
                      key={firstTraining?.date ?? index}
                      trainingSessions={trainingSessions}
                    />
                  )
                })}
              </QRCode>
            }
            title={year}
          />
        </h2>
        <QRCode>
          {yearlyTraining.map((trainingSessions, index) => {
            const [firstTraining] = trainingSessions
            return (
              <TrainingsQRDot
                key={firstTraining?.date ?? index}
                trainingSessions={trainingSessions}
              />
            )
          })}
        </QRCode>
      </div>
    ))
}

export const metadata: Metadata = {
  description: 'QR Code visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'qr code'],
  title: 'Training Sessions QR Code Visualization 🖼️',
}
