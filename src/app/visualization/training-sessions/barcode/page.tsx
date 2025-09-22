import type { Metadata } from 'next'
import { lazy, Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import NotFound from '~/app/not-found'
import { groupDataWeeksByYear } from '~/data/helpers'
import { api } from '~/trpc/server'

// LAZY LOADING: Load barcode component only when needed
const TrainingSessionsBarcode = lazy(() =>
  import('~/app/_components/barcode/barcode').then(module => ({
    default: module.TrainingSessionsBarcode,
  })),
)

export default async function TrainingSessionsBarcodePage() {
  const trainingSessions = await api.training.getAll()

  if (!trainingSessions) return <NotFound />

  const groupedTrainingWeekly = groupDataWeeksByYear(trainingSessions)

  return Object.entries(groupedTrainingWeekly)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearTraining]) => (
      <div className="flexColumn w100" key={year}>
        <h2 className="centerText">{year}</h2>
        <Suspense fallback={<Loader />}>
          <TrainingSessionsBarcode yearlyTraining={yearTraining} />
        </Suspense>
      </div>
    ))
}

export const metadata: Metadata = {
  description: 'Barcode visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'barcode'],
  title: 'Training Sessions Barcode Visualization 🖼️',
}
