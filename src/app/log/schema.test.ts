import { describe, expect, it } from 'vite-plus/test'
import { climbingLogFormSchema } from './schema'

const ascent = {
  discipline: 'Sport',
  grade: '7a',
  name: 'Berlin',
  style: 'Redpoint',
  tries: '2',
} as const

const common = {
  date: '2026-07-30',
  discipline: 'Sport',
  location: 'Céüse',
  training: {},
} as const

describe('climbing log form schema', () => {
  it('creates a canonical ascent-only log', () => {
    const result = climbingLogFormSchema.parse({
      ...common,
      ascents: [ascent],
      includeTraining: false,
    })

    expect(result).toStrictEqual({
      ascents: [
        {
          crag: 'Céüse',
          date: '2026-07-30',
          discipline: 'Sport',
          grade: '7a',
          name: 'Berlin',
          style: 'Redpoint',
          tries: 2,
        },
      ],
      training: undefined,
    })
  })

  it('creates a canonical training-only log', () => {
    const result = climbingLogFormSchema.parse({
      ...common,
      ascents: [],
      includeTraining: true,
      training: {
        intensity: '80',
        type: 'Endurance',
        volume: '60',
      },
    })

    expect(result).toStrictEqual({
      ascents: [],
      training: {
        date: '2026-07-30',
        discipline: 'Sport',
        intensity: 80,
        location: 'Céüse',
        type: 'Endurance',
        volume: 60,
      },
    })
  })

  it('supports a combined log with per-ascent discipline overrides', () => {
    const result = climbingLogFormSchema.parse({
      ...common,
      ascents: [ascent, { ...ascent, discipline: 'Bouldering', name: 'Big Boss' }],
      includeTraining: true,
      training: { type: 'Outdoor' },
    })

    expect(result.training?.type).toBe('Outdoor')
    expect(result.ascents.map(({ discipline }) => discipline)).toStrictEqual([
      'Sport',
      'Bouldering',
    ])
  })

  it('rejects empty logs and ascents without a location', () => {
    expect(
      climbingLogFormSchema.safeParse({
        ...common,
        ascents: [],
        includeTraining: false,
      }).success,
    ).toBe(false)
    expect(
      climbingLogFormSchema.safeParse({
        ...common,
        ascents: [ascent],
        includeTraining: false,
        location: '',
      }).success,
    ).toBe(false)
  })
})
