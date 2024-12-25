import { Link } from 'next-view-transitions'
import Barcode from '~/app/_components/barcode/barcode'
import { createYearList } from '~/data/ascent-data'
import { getYearsTrainingPerWeek } from '~/data/training-data'
import { api } from '~/trpc/server'
import { trainingSessionsBarcodeRender } from './helpers.tsx'

export default async function Page() {
  const trainingSessions = await api.training.getAllTrainingSessions()
  return (
    <section className="w100">
      <h1 className="center-text">Training</h1>
      <div className="grid">
        {Object.values(getYearsTrainingPerWeek(trainingSessions))
          .map((yearTraining, i) => {
            const trainingYear = createYearList(trainingSessions)
            const year =
              trainingYear[trainingYear.length - 1 - i]?.toString() ?? ''
            return (
              <div key={year} className="flex-column w100">
                <h2 className="center-text">
                  <Link href={`/training/barcode/${year}`}>{year}</Link>
                </h2>
                <Barcode
                  data={yearTraining}
                  itemRender={trainingSessionsBarcodeRender}
                />
              </div>
            )
          })
          .reverse()}
      </div>
    </section>
  )
}
