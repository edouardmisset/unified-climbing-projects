import { lazy, Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import NotFound from '~/app/not-found'
import { groupDataDaysByYear } from '~/data/helpers'
import { getAllTrainingSessions } from '~/services/training'

const TrainingQRCode = lazy(async () =>
  import('~/app/_components/qr-code/qr-code').then(module => ({
    default: module.TrainingQRCode,
  })),
)

export async function QRCodeContent() {
  const trainingSessions = await getAllTrainingSessions()

  if (trainingSessions.length === 0) return <NotFound />

  const groupedTrainingDaily = groupDataDaysByYear(trainingSessions)

  return Object.entries(groupedTrainingDaily)
    .toSorted(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearlyTraining]) => (
      <div className='flexColumn alignCenter' key={year}>
        <h2 className='centerText'>{year}</h2>
        <Suspense fallback={<Loader />}>
          <TrainingQRCode yearlyTrainingSessions={yearlyTraining} />
        </Suspense>
      </div>
    ))
}
