import { render } from '@testing-library/react'
import { describe, expect, test } from 'vite-plus/test'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { AscentPyramid } from './ascents-pyramid/ascent-pyramid'
import { AscentsPerDiscipline } from './ascents-per-discipline/ascents-per-discipline'
import { AscentsPerDisciplinePerGrade } from './ascents-per-discipline-per-grade/ascents-per-discipline-per-grade'
import { AscentsPerYearByGrade } from './ascents-per-year-by-grade/ascents-per-year-by-grade'
import { TrainingSessionsDistribution } from './training-sessions-distribution/training-sessions-distribution'
import { TrainingSessionsPerDiscipline } from './training-sessions-per-discipline/training-sessions-per-discipline'

const sampleAscents: Ascent[] = [
  {
    _id: 'a01',
    crag: 'Fontainebleau',
    date: '2023-04-10',
    discipline: 'Sport',
    grade: '6a',
    name: 'Route A',
    style: 'Onsight',
    tries: 1,
  },
  {
    _id: 'a02',
    crag: 'Fontainebleau',
    date: '2023-05-15',
    discipline: 'Sport',
    grade: '6c',
    name: 'Route B',
    style: 'Redpoint',
    tries: 4,
  },
  {
    _id: 'a03',
    crag: 'Fontainebleau',
    date: '2023-06-20',
    discipline: 'Bouldering',
    grade: '7a',
    name: 'Problem A',
    style: 'Flash',
    tries: 2,
  },
  {
    _id: 'a04',
    crag: 'Kalymnos',
    date: '2023-09-01',
    discipline: 'Sport',
    grade: '7a',
    name: 'Route C',
    style: 'Onsight',
    tries: 1,
  },
  {
    _id: 'a05',
    crag: 'Kalymnos',
    date: '2023-09-05',
    discipline: 'Sport',
    grade: '7a+',
    name: 'Route D',
    style: 'Redpoint',
    tries: 6,
  },
  {
    _id: 'a06',
    crag: 'Kalymnos',
    date: '2023-09-10',
    discipline: 'Sport',
    grade: '7b',
    name: 'Route E',
    style: 'Flash',
    tries: 2,
  },
  {
    _id: 'a07',
    crag: 'Ceuse',
    date: '2024-06-03',
    discipline: 'Sport',
    grade: '7a',
    name: 'Route F',
    style: 'Onsight',
    tries: 1,
  },
  {
    _id: 'a08',
    crag: 'Ceuse',
    date: '2024-06-10',
    discipline: 'Sport',
    grade: '7b',
    name: 'Route G',
    style: 'Redpoint',
    tries: 8,
  },
  {
    _id: 'a09',
    crag: 'Ceuse',
    date: '2024-07-01',
    discipline: 'Bouldering',
    grade: '7a',
    name: 'Problem B',
    style: 'Flash',
    tries: 2,
  },
  {
    _id: 'a10',
    crag: 'Ceuse',
    date: '2024-07-15',
    discipline: 'Sport',
    grade: '7c',
    name: 'Route H',
    style: 'Redpoint',
    tries: 12,
  },
]

const sampleTrainingSessions: TrainingSession[] = [
  {
    _id: 's1',
    date: '2024-03-04',
    discipline: 'Sport',
    type: 'Endurance',
    intensity: 70,
    volume: 80,
  },
  {
    _id: 's2',
    date: '2024-04-08',
    discipline: 'Bouldering',
    type: 'Power',
    intensity: 90,
    volume: 60,
  },
  {
    _id: 's3',
    date: '2024-05-13',
    type: 'Contact Strength',
    intensity: 85,
    volume: 70,
  },
  {
    _id: 's4',
    date: '2024-06-17',
    discipline: 'Sport',
    type: 'Max Strength',
    intensity: 95,
    volume: 50,
  },
  {
    _id: 's5',
    date: '2024-07-22',
    type: 'Stamina',
    intensity: 65,
    volume: 90,
  },
  {
    _id: 's6',
    date: '2024-08-12',
    discipline: 'Bouldering',
    type: 'Power Endurance',
    intensity: 80,
    volume: 75,
  },
]

describe('AscentPyramid', () => {
  test('renders with ascent data', async () => {
    const { container } = render(<AscentPyramid ascents={sampleAscents} />)
    await expect.element(container.firstElementChild).toMatchScreenshot()
  })
})

describe('AscentsPerDiscipline', () => {
  test('renders with ascent data', async () => {
    const { container } = render(<AscentsPerDiscipline ascents={sampleAscents} />)
    await expect.element(container.firstElementChild).toMatchScreenshot()
  })
})

describe('AscentsPerDisciplinePerGrade', () => {
  test('renders with mixed-discipline ascent data', async () => {
    const { container } = render(<AscentsPerDisciplinePerGrade ascents={sampleAscents} />)
    await expect.element(container.firstElementChild).toMatchScreenshot()
  })
})

describe('AscentsPerYearByGrade', () => {
  test('renders with multi-year ascent data', async () => {
    const { container } = render(<AscentsPerYearByGrade ascents={sampleAscents} />)
    await expect.element(container.firstElementChild).toMatchScreenshot()
  })
})

describe('TrainingSessionsDistribution', () => {
  test('renders with training session data', async () => {
    const { container } = render(
      <TrainingSessionsDistribution trainingSessions={sampleTrainingSessions} />,
    )
    await expect.element(container.firstElementChild).toMatchScreenshot()
  })
})

describe('TrainingSessionsPerDiscipline', () => {
  test('renders with training session data', async () => {
    const { container } = render(
      <TrainingSessionsPerDiscipline trainingSessions={sampleTrainingSessions} />,
    )
    await expect.element(container.firstElementChild).toMatchScreenshot()
  })
})
