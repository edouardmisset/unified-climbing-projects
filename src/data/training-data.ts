import { getWeek } from '~/app/_components/year-grid/helpers.ts'
import type { TrainingSession } from '~/schema/training'
import { createEmptyBarcodeCollection } from '../data/helpers'

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
