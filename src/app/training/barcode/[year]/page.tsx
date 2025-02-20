import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import Barcode from '~/app/_components/barcode/barcode'
import { TrainingBar } from '~/app/_components/barcode/training-bar.tsx'
import { groupDataWeeksByYear } from '~/data/helpers'
import { api } from '~/trpc/server'

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const year = validNumberWithFallback((await props.params).year, -1)

  const trainingSessions = await api.training.getAllTrainingSessions()

  const selectedTraining = groupDataWeeksByYear(trainingSessions)[year]

  if (selectedTraining === undefined) return <span>No Data</span>

  return (
    <section className="w100">
      <h1 className="section-header">{year}</h1>
      <Barcode>
        {selectedTraining.map((weeklyTraining, index) => (
          <TrainingBar
            key={weeklyTraining[0]?.date ?? index}
            weeklyTraining={weeklyTraining}
          />
        ))}
      </Barcode>
    </section>
  )
}
