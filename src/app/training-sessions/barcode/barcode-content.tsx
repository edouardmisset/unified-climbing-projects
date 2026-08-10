import { lazy, Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import NotFound from '~/app/not-found'
import { groupDataWeeksByYear } from '~/data/helpers'
import { getAllTrainingSessions } from '~/services/training'

const TrainingSessionsBarcode = lazy(async () =>
  import('~/app/_components/barcode/barcode').then(module => ({
    default: module.TrainingSessionsBarcode,
  })),
)

export async function BarcodeContent() {
  const trainingSessions = await getAllTrainingSessions()

  if (trainingSessions.length === 0) return <NotFound />

  const groupedTrainingWeekly = groupDataWeeksByYear(trainingSessions)

  return Object.entries(groupedTrainingWeekly)
    .toSorted(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearTraining]) => (
      <div className='flexColumn w100' key={year}>
        <h2 className='centerText'>{year}</h2>
        <Suspense fallback={<Loader />}>
          <TrainingSessionsBarcode yearlyTraining={yearTraining} />
        </Suspense>
      </div>
    ))
}
