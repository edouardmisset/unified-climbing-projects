import type { Metadata } from 'next'
import { Barcode } from '~/app/_components/barcode/barcode'
import { TrainingBar } from '~/app/_components/barcode/training-bar'
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
            title={year}
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
    ))
}

export const metadata: Metadata = {
  description: 'Barcode visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'barcode'],
  title: 'Training Sessions Barcode Visualization 🖼️',
}
