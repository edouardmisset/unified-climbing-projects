import { Temporal } from '@js-temporal/polyfill'
import { isDataResponse } from '~/types/generic'

import { trainingSessionSchema, type TrainingSession } from '~/types/training'

const parsedTrainingData = await fetch(
  'https://climbing-back.deno.dev/api/training',
)
  .then(response => response.json())
  .then((json) => {
    if (!(isDataResponse(json)))
      throw new Error('Invalid response')

    return trainingSessionSchema.array().parse(json.data)
  }).catch((error) => {
    console.error(error)
    return []
  }
  )

const trainingSeasons = [
  ...new Set(parsedTrainingData.map(({ date }) => date.year)),
].reverse()

const trainingCollection: Record<number, TrainingSession[]> =
  Object.fromEntries(
    trainingSeasons.map(season => {
      const daysPerYear = 365
      return [
        season,
        Array.from({ length: daysPerYear })
          .fill(undefined)
          .map((_, i) => ({
            date: Temporal.PlainDate.from({
              day: 1,
              month: 1,
              year: season,
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
