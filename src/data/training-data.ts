import type { TemporalDateTime } from '~/types/generic'

import type { TrainingSession } from '~/types/training'
import { createEmptyBarcodeCollection } from './ascent-data'
import { createEmptyYearlyCollections } from './helpers'

const getTrainingSeasons = (trainingSessions: TrainingSession[]) =>
  [...new Set(trainingSessions.map(({ date }) => date.year))].reverse()

const getTrainingCollection: (
  trainingSessions: TrainingSession[],
) => Record<number, (TemporalDateTime & TrainingSession)[]> = (
  trainingSessions: TrainingSession[],
) => createEmptyYearlyCollections(getTrainingSeasons(trainingSessions))

export const getSeasonTraining = (trainingSessions: TrainingSession[]) =>
  trainingSessions.reduce(
    (acc, trainingSession) => {
      const {
        date: { year },
      } = trainingSession

      if (acc[year] === undefined) return acc

      acc[year][trainingSession.date.dayOfYear - 1] = trainingSession
      return acc
    },
    { ...getTrainingCollection(trainingSessions) },
  )

export const getSeasonsTrainingPerWeek = (
  trainingSessions: TrainingSession[],
) =>
  trainingSessions.reduce(
    (accumulator, training) => {
      const {
        date: { year, weekOfYear },
      } = training

      const weekTrainingSessions = accumulator[year]?.[weekOfYear]

      if (accumulator[year] === undefined) return accumulator

      accumulator[year][weekOfYear] = weekTrainingSessions
        ? [...weekTrainingSessions, training]
        : [training]

      return accumulator
    },
    { ...createEmptyBarcodeCollection(trainingSessions) },
  )
