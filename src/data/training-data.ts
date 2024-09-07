import { Temporal } from '@js-temporal/polyfill'
import { isDataResponse } from '~/types/generic'

import { trainingSessionSchema, type TrainingSession } from '~/types/training'
import { createEmptyBarcodeCollection } from './ascent-data'

const parsedTrainingData = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/training`,
)
  .then(response => response.json())
  .then(json => {
    if (!isDataResponse(json)) throw new Error('Invalid response')

    return trainingSessionSchema.array().parse(json.data)
  })
  .catch(error => {
    console.error(error)
    return [] as TrainingSession[]
  })

const trainingSeasons = [
  ...new Set(parsedTrainingData.map(({ date }) => date.year)),
].reverse()

const trainingCollection: Record<number, TrainingSession[]> =
  Object.fromEntries(
    trainingSeasons.map(year => {
      const daysPerYear = Temporal.PlainDate.from({
        year, month: 1, day: 1
      }).daysInYear

      return [
        year,
        Array.from({ length: daysPerYear })
          .fill(undefined)
          .map((_, i) => ({
            date: Temporal.PlainDate.from({
              day: 1,
              month: 1,
              year,
            }).add({ days: i }),
          })),
      ]
    }),
  )

export const seasonTraining = parsedTrainingData.reduce(
  (acc, trainingSession) => {
    acc[trainingSession.date.year]![trainingSession.date.dayOfYear - 1] =
      trainingSession
    return acc
  },
  { ...trainingCollection },
)

export const seasonsTrainingPerWeek = parsedTrainingData.reduce(
  (accumulator, training) => {
    const {
      date: { year, weekOfYear },
    } = training

    const weekTrainingSessions = accumulator[year]?.[weekOfYear]
    accumulator[year]![weekOfYear] =
      weekTrainingSessions ? [...weekTrainingSessions, training] : [training]

    return accumulator
  },
  { ...createEmptyBarcodeCollection<TrainingSession>() },
)
