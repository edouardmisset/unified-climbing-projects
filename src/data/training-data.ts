import { type TemporalDateTime, isDataResponse } from '~/types/generic'

import { type TrainingSession, trainingSessionSchema } from '~/types/training'
import { createEmptyBarcodeCollection } from './ascent-data'
import { createEmptyYearlyCollections } from './helpers'

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

const trainingCollection: Record<
  number,
  (TemporalDateTime & TrainingSession)[]
> = createEmptyYearlyCollections(trainingSeasons)

export const seasonTraining = parsedTrainingData.reduce(
  (acc, trainingSession) => {
    const {
      date: { year },
    } = trainingSession

    if (acc[year] === undefined) return acc

    acc[year][trainingSession.date.dayOfYear - 1] = trainingSession
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

    if (accumulator[year] === undefined) return accumulator

    accumulator[year][weekOfYear] = weekTrainingSessions
      ? [...weekTrainingSessions, training]
      : [training]

    return accumulator
  },
  { ...createEmptyBarcodeCollection<TrainingSession>() },
)
