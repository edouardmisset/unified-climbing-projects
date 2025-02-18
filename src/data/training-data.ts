import type { StringDateTime } from '~/types/generic'

import { getWeek } from '~/app/_components/year-grid/helpers.ts'
import { getDayOfYear } from '~/helpers/date.ts'
import type { TrainingSession } from '~/schema/training'
import { createEmptyBarcodeCollection } from './ascent-data.ts'
import { createEmptyYearlyCollections } from './helpers.ts'

const getTrainingYears = (trainingSessions: TrainingSession[]) =>
  [
    ...new Set(
      trainingSessions.map(({ date }) => new Date(date).getFullYear()),
    ),
  ].sort((a, b) => b - a)

const getTrainingCollection = (
  trainingSessions: TrainingSession[],
): Record<number, TrainingSession[][]> =>
  createEmptyYearlyCollections<TrainingSession>(
    getTrainingYears(trainingSessions),
  )

export const getYearTraining = (
  trainingSessions: TrainingSession[],
): Record<number, TrainingSession[][]> =>
  trainingSessions.reduce((accumulator, trainingSession) => {
    const date = new Date(trainingSession.date)
    const year = date.getFullYear()
    const dayOfYear = getDayOfYear(date) - 1

    if (accumulator[year] === undefined) return accumulator

    const currentDayTraining = accumulator[year][dayOfYear]

    accumulator[year][dayOfYear] = [
      ...(currentDayTraining !== undefined ? currentDayTraining : []),
      trainingSession,
    ]
    return accumulator
  }, getTrainingCollection(trainingSessions))

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
