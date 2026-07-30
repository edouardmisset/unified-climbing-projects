import { render } from '@testing-library/react'
import { describe, expect, test } from 'vite-plus/test'
import { groupDataDaysByYear } from '~/data/helpers'
import { fromAscentsToCalendarEntries } from '~/helpers/ascent-calendar-helpers'
import { fromTrainingSessionsToCalendarEntries } from '~/helpers/training-calendar-helpers'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { DataCalendar } from './data-calendar'

const YEAR = 2024

const sampleAscents: Ascent[] = [
  {
    _id: 'a1',
    crag: 'Fontainebleau',
    date: '2024-06-03',
    discipline: 'Sport',
    grade: '7a',
    name: 'Route 1',
    style: 'Redpoint',
    tries: 3,
  },
  {
    _id: 'a2',
    crag: 'Fontainebleau',
    date: '2024-06-04',
    discipline: 'Sport',
    grade: '7b',
    name: 'Route 2',
    style: 'Onsight',
    tries: 1,
  },
  {
    _id: 'a3',
    crag: 'Kalymnos',
    date: '2024-09-10',
    discipline: 'Bouldering',
    grade: '7a+',
    name: 'Problem 1',
    style: 'Flash',
    tries: 2,
  },
  {
    _id: 'a4',
    crag: 'Ceuse',
    date: '2024-07-17',
    discipline: 'Sport',
    grade: '7c',
    name: 'Route 3',
    style: 'Redpoint',
    tries: 5,
  },
]

const sampleTrainingSessions: TrainingSession[] = [
  {
    _id: 's1',
    date: '2024-03-04',
    type: 'Endurance',
    intensity: 70,
    volume: 80,
  },
  {
    _id: 's2',
    date: '2024-05-10',
    type: 'Power',
    intensity: 90,
    volume: 60,
  },
  {
    _id: 's3',
    date: '2024-08-19',
    type: 'Contact Strength',
    intensity: 85,
    volume: 70,
  },
]

describe('DataCalendar', () => {
  test('renders ascent calendar for a year', async () => {
    const { container } = render(
      <DataCalendar
        data={sampleAscents}
        dataTransformationFunction={groupDataDaysByYear}
        fromDataToCalendarEntries={fromAscentsToCalendarEntries}
        year={YEAR}
      />,
    )
    await expect.element(container.firstElementChild).toMatchScreenshot()
  })

  test('renders training session calendar for a year', async () => {
    const { container } = render(
      <DataCalendar
        data={sampleTrainingSessions}
        dataTransformationFunction={groupDataDaysByYear}
        fromDataToCalendarEntries={(year, sessions) =>
          fromTrainingSessionsToCalendarEntries(year, sessions, sampleAscents)
        }
        year={YEAR}
      />,
    )
    await expect.element(container.firstElementChild).toMatchScreenshot()
  })
})
