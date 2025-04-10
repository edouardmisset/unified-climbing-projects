import { Suspense } from 'react'
import { Barcode } from '~/app/_components/barcode/barcode'
import { TrainingBar } from '~/app/_components/barcode/training-bar'
import { Dialog } from '~/app/_components/dialog/dialog'
import { Loader } from '~/app/_components/loader/loader'
import NotFound from '~/app/not-found'
import { groupDataWeeksByYear } from '~/data/helpers'
import { api } from '~/trpc/server'

export default async function TrainingSessionsBarcodePage() {
  const trainingSessions = await api.training.getAllTrainingSessions()

  if (!trainingSessions) return <NotFound />

  const groupedTrainingWeekly = groupDataWeeksByYear(trainingSessions)

  return (
    <Suspense fallback={<Loader />}>
      {Object.entries(groupedTrainingWeekly)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, yearTraining]) => (
          <div key={year} className="flex-column w100">
            <h2 className="center-text">
              <Dialog
                title={year}
                content={
                  <Barcode>
                    {yearTraining.map((weeklyTraining, index) => {
                      const [firstTrainingOfTheWeek] = weeklyTraining
                      return (
                        <TrainingBar
                          key={firstTrainingOfTheWeek?.date ?? index}
                          weeklyTraining={weeklyTraining}
                        />
                      )
                    })}
                  </Barcode>
                }
              />
            </h2>
            <Barcode>
              {yearTraining.map((weeklyTraining, index) => {
                const [firstTrainingOfTheWeek] = weeklyTraining
                return (
                  <TrainingBar
                    key={firstTrainingOfTheWeek?.date ?? index}
                    weeklyTraining={weeklyTraining}
                  />
                )
              })}
            </Barcode>
          </div>
        ))}
    </Suspense>
  )
}

export const metadata = {
  title: 'Training Sessions Barcode Visualization 🖼️',
  description: 'Barcode visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'barcode'],
}
