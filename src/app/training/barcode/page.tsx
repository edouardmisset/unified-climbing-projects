import { Link } from 'next-view-transitions'
import Barcode from '~/app/_components/barcode/barcode'
import GridLayout from '~/app/_components/grid-layout/grid-layout.tsx'
import { getYearsTrainingPerWeek } from '~/data/training-data'
import { api } from '~/trpc/server'
import { TrainingBars } from '../../_components/barcode/training-bars.tsx'

export default async function Page() {
  const trainingSessions = await api.training.getAllTrainingSessions()
  return (
    <GridLayout title="Training">
      {Object.entries(getYearsTrainingPerWeek(trainingSessions))
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, yearTraining]) => (
          <div key={year} className="flex-column w100">
            <h2 className="center-text">
              <Link href={`/training/barcode/${year}`} prefetch={true}>
                {year}
              </Link>
            </h2>
            <Barcode>
              {yearTraining.map(weeklyTraining => (
                <TrainingBars
                  key={weeklyTraining[0]?.date}
                  weeklyTraining={weeklyTraining}
                />
              ))}
            </Barcode>
          </div>
        ))}
    </GridLayout>
  )
}
