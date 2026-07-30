import { render } from '@testing-library/react'
import { describe, expect, test, vi } from 'vite-plus/test'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { AscentsQRCode } from './ascents-qr-code'
import { TrainingQRCode } from './training-qr-code'

vi.mock(import('next/image'), () => ({
  default: ({ src, alt, width, height }: { src: unknown; alt: string; width?: number; height?: number }) => (
    <img
      alt={alt}
      height={height}
      src={typeof src === 'string' ? src : (src as { src: string }).src ?? ''}
      width={width}
    />
  ),
}))

const sampleAscents: Ascent[][] = [
  [
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
  ],
  [
    {
      _id: 'a3',
      crag: 'Kalymnos',
      date: '2024-06-10',
      discipline: 'Bouldering',
      grade: '7a+',
      name: 'Problem 1',
      style: 'Flash',
      tries: 2,
    },
  ],
  [
    {
      _id: 'a4',
      crag: 'Ceuse',
      date: '2024-06-17',
      discipline: 'Sport',
      grade: '7c',
      name: 'Route 3',
      style: 'Redpoint',
      tries: 5,
    },
  ],
]

const sampleTrainingSessions: TrainingSession[][] = [
  [
    {
      _id: 's1',
      date: '2024-06-03',
      type: 'Endurance',
      intensity: 70,
      volume: 80,
    },
    {
      _id: 's2',
      date: '2024-06-04',
      type: 'Power',
      intensity: 90,
      volume: 60,
    },
  ],
  [
    {
      _id: 's3',
      date: '2024-06-10',
      type: 'Contact Strength',
      intensity: 85,
      volume: 70,
    },
  ],
  [
    {
      _id: 's4',
      date: '2024-06-17',
      type: 'Max Strength',
      intensity: 95,
      volume: 50,
    },
  ],
]

describe('AscentsQRCode', () => {
  test('renders with weekly ascent data', async () => {
    const { container } = render(<AscentsQRCode yearlyAscents={sampleAscents} />)
    await expect.element(container.firstElementChild).toMatchScreenshot()
  })
})

describe('TrainingQRCode', () => {
  test('renders with weekly training session data', async () => {
    const { container } = render(
      <TrainingQRCode yearlyTrainingSessions={sampleTrainingSessions} />,
    )
    await expect.element(container.firstElementChild).toMatchScreenshot()
  })
})
