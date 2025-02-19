import { getWeek } from '~/app/_components/year-grid/helpers.ts'
import { getDayOfYear } from '~/helpers/date.ts'
import type { TrainingSession } from '~/schema/training'
import { createEmptyBarcodeCollection, createYearList } from './ascent-data.ts'
import { createEmptyYearlyDaysCollection } from './helpers.ts'

const createYearlyTrainingDaysCollection = (
  trainingSessions: TrainingSession[],
): { [year: number]: TrainingSession[][] } =>
  createEmptyYearlyDaysCollection<TrainingSession>(
    createYearList(trainingSessions),
  )

export function groupTrainingDaysByYear(trainingSessions: TrainingSession[]): {
  [year: number]: TrainingSession[][]
} {
  const groupedTrainingSessionsByYear = trainingSessions.reduce(
    (accumulator, trainingSession) => {
      const date = new Date(trainingSession.date)
      const year = date.getFullYear()
      const dayOfYear = getDayOfYear(date) - 1

      if (accumulator[year] === undefined) return accumulator

      const currentDayTraining = accumulator[year][dayOfYear]

      accumulator[year][dayOfYear] = [
        ...(currentDayTraining === undefined ? [] : currentDayTraining),
        trainingSession,
      ]
      return accumulator
    },
    createYearlyTrainingDaysCollection(trainingSessions),
  )
  return groupedTrainingSessionsByYear
}

export const getYearsTrainingPerWeek = (trainingSessions: TrainingSession[]) =>
  trainingSessions.reduce(
    (accumulator, trainingSession) => {
      const date = new Date(trainingSession.date)
      const year = date.getFullYear()
      const weekOfYear = getWeek(date)

      const weekTrainingSessions = accumulator[year]?.[weekOfYear]

      if (accumulator[year] === undefined) return accumulator

      accumulator[year][weekOfYear] = weekTrainingSessions
        ? [...weekTrainingSessions, trainingSession]
        : [trainingSession]

      return accumulator
    },
    { ...createEmptyBarcodeCollection(trainingSessions) },
  )
