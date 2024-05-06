import { Temporal } from "@js-temporal/polyfill"

import { trainingSessionSchema, type TrainingSession } from "~/types/training"

import trainingData from '~/data/training-data.json'


const parsedTrainingData = trainingSessionSchema.array().parse(trainingData)


const trainingSeasons = [
  ...new Set(parsedTrainingData.map(({ date }) => date.year)),
]
  .filter(s => s !== Temporal.Now.plainDateISO().year)
  .reverse()



const trainingQRCodeCollection: Record<number, TrainingSession[]> =
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

export const seasonTraining = parsedTrainingData
  .filter(({ date }) => Temporal.Now.plainDateISO().year !== date.year)
  .reduce(
    (acc, trainingSession) => {
      acc[trainingSession.date.year]![trainingSession.date.dayOfYear - 1] =
        trainingSession
      return acc
    },
    { ...trainingQRCodeCollection },
  )
