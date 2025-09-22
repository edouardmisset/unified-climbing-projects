import type { Metadata } from 'next'
import { lazy, Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import NotFound from '~/app/not-found'
import { groupDataDaysByYear } from '~/data/helpers'
import { api } from '~/trpc/server'

// LAZY LOADING: Load QR code component only when needed
const TrainingQRCode = lazy(() =>
  import('~/app/_components/qr-code/qr-code').then(module => ({
    default: module.TrainingQRCode,
  })),
)

export default async function TrainingSessionsQRCodePage() {
  const trainingSessions = await api.training.getAll()

  if (!trainingSessions) return <NotFound />

  const groupedTrainingDaily = groupDataDaysByYear(trainingSessions)

  return Object.entries(groupedTrainingDaily)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearlyTraining]) => (
      <div className="flexColumn alignCenter" key={year}>
        <h2 className="centerText">{year}</h2>
        <Suspense fallback={<Loader />}>
          <TrainingQRCode yearlyTrainingSessions={yearlyTraining} />
        </Suspense>
      </div>
    ))
}

export const metadata: Metadata = {
  description: 'QR Code visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'qr code'],
  title: 'Training Sessions QR Code Visualization 🖼️',
}
