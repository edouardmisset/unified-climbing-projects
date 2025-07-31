import type { Metadata } from 'next'
import { TrainingSessionsBarcode } from '~/app/_components/barcode/barcode'
import { Dialog } from '~/app/_components/dialog/dialog'
import NotFound from '~/app/not-found'
import { groupDataWeeksByYear } from '~/data/helpers'
import { api } from '~/trpc/server'

export default async function TrainingSessionsBarcodePage() {
  const trainingSessions = await api.training.getAll()

  if (!trainingSessions) return <NotFound />

  const groupedTrainingWeekly = groupDataWeeksByYear(trainingSessions)

  return Object.entries(groupedTrainingWeekly)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearTraining]) => (
      <div className="flex-column w100" key={year}>
        <h2 className="center-text">
          <Dialog
            content={<TrainingSessionsBarcode yearTraining={yearTraining} />}
            title={year}
          />
        </h2>
        <TrainingSessionsBarcode yearTraining={yearTraining} />
      </div>
    ))
}

export const metadata: Metadata = {
  description: 'Barcode visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'barcode'],
  title: 'Training Sessions Barcode Visualization 🖼️',
}
