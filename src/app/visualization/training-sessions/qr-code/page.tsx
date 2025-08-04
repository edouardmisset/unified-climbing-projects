import type { Metadata } from 'next'
import { Dialog } from '~/app/_components/dialog/dialog'
import { TrainingQRCode } from '~/app/_components/qr-code/qr-code'
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
        <h2 className="centerText">
          <Dialog
            content={<TrainingQRCode yearlyTrainingSessions={yearlyTraining} />}
            title={year}
          />
        </h2>
        <TrainingQRCode yearlyTrainingSessions={yearlyTraining} />
      </div>
    ))
}

export const metadata: Metadata = {
  description: 'QR Code visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'qr code'],
  title: 'Training Sessions QR Code Visualization 🖼️',
}
