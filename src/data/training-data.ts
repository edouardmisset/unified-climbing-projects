import type { StringDateTime } from '~/types/generic'

import { parseISODateToTemporal } from '~/schema/ascent.ts'
import type { TrainingSession } from '~/types/training'
import { createEmptyBarcodeCollection } from './ascent-data.ts'
import { createEmptyYearlyCollections } from './helpers.ts'

const getTrainingYears = (trainingSessions: TrainingSession[]) =>
  [
    ...new Set(
      trainingSessions.map(({ date }) => parseISODateToTemporal(date).year),
    ),
  ].reverse()

const getTrainingCollection: (
  trainingSessions: TrainingSession[],
) => Record<number, (StringDateTime & TrainingSession)[]> = (
  trainingSessions: TrainingSession[],
) => createEmptyYearlyCollections(getTrainingYears(trainingSessions))

export const getYearTraining = (trainingSessions: TrainingSession[]) =>
  trainingSessions.reduce(
    (acc, trainingSession) => {
      const { year, dayOfYear } = parseISODateToTemporal(trainingSession.date)

      if (acc[year] === undefined) return acc

      acc[year][dayOfYear - 1] = trainingSession
      return acc
    },
    { ...getTrainingCollection(trainingSessions) },
  )

export const getYearsTrainingPerWeek = (trainingSessions: TrainingSession[]) =>
  trainingSessions.reduce(
    (accumulator, training) => {
      const { year, weekOfYear } = parseISODateToTemporal(training.date)

      const weekTrainingSessions = accumulator[year]?.[weekOfYear]

      if (accumulator[year] === undefined) return accumulator

      accumulator[year][weekOfYear] = weekTrainingSessions
        ? [...weekTrainingSessions, training]
        : [training]

      return accumulator
    },
    { ...createEmptyBarcodeCollection(trainingSessions) },
  )
