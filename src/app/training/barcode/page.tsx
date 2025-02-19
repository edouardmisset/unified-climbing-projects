import { Link } from 'next-view-transitions'
import Barcode from '~/app/_components/barcode/barcode'
import { TrainingBar } from '~/app/_components/barcode/training-bar.tsx'
import GridLayout from '~/app/_components/grid-layout/grid-layout.tsx'
import { groupDataWeeksByYear } from '~/data/helpers'
import { api } from '~/trpc/server'

export default async function Page() {
  const trainingSessions = await api.training.getAllTrainingSessions()
  return (
    <GridLayout title="Training">
      {Object.entries(groupDataWeeksByYear(trainingSessions))
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, yearTraining]) => (
          <div key={year} className="flex-column w100">
            <h2 className="center-text">
              <Link href={`/training/barcode/${year}`} prefetch={true}>
                {year}
              </Link>
            </h2>
            <Barcode>
              {yearTraining.map((weeklyTraining, index) => (
                <TrainingBar
                  key={weeklyTraining[0]?.date ?? index}
                  weeklyTraining={weeklyTraining}
                />
              ))}
            </Barcode>
          </div>
        ))}
    </GridLayout>
  )
}
