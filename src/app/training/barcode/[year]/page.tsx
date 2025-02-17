import Barcode from '~/app/_components/barcode/barcode'
import { getYearsTrainingPerWeek } from '~/data/training-data'
import { api } from '~/trpc/server'
import { TrainingBars } from '../../../_components/barcode/training-bars.tsx'

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const { year } = await props.params

  const trainingSessions = await api.training.getAllTrainingSessions()

  const selectedTraining = getYearsTrainingPerWeek(trainingSessions)[year]

  if (selectedTraining === undefined) return <span>No Data</span>

  return (
    <section className="w100">
      <h1 className="section-header">{year}</h1>
      <Barcode>
        {selectedTraining.map(weeklyTraining => (
          <TrainingBars
            key={weeklyTraining[0]?.date}
            weeklyTraining={weeklyTraining}
          />
        ))}
      </Barcode>
    </section>
  )
}
