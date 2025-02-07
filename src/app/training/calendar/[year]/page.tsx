import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import DataCalendar from '~/app/_components/data-calendar/data-calendar'
import { getYearTraining } from '~/data/training-data'
import { api } from '~/trpc/server'
import { fromTrainingSessionsToCalendarEntries } from './helpers'

export default async function TrainingCalendar(props: {
  params: Promise<{ year: string }>
}) {
  const year = validNumberWithFallback(
    (await props.params).year,
    new Date().getFullYear(),
  )

  const trainingSessions = await api.training.getAllTrainingSessions()

  return (
    <DataCalendar
      year={year}
      data={trainingSessions}
      dataTransformationFunction={getYearTraining}
      header="Training"
      fromDataToCalendarEntries={fromTrainingSessionsToCalendarEntries}
    />
  )
}
