import { describe, expect, it } from 'vite-plus/test'
import { climbingLogFormSchema } from './schema'

const ascent = {
  discipline: 'Sport',
  grade: '7a',
  name: 'Berlin',
  style: 'Redpoint',
  tries: '2',
} as const

const generalDetails = {
  date: '2026-07-30',
  discipline: 'Sport',
  location: 'Céüse',
  hasTraining: false,
  training: {},
} as const

describe('climbing log form schema', () => {
  it('ignores removed training even when its retained fields are invalid', () => {
    const result = climbingLogFormSchema.parse({
      ...generalDetails,
      ascents: [ascent],
      training: { intensity: '999', type: '' },
    })
    expect(result.training).toBeUndefined()
    expect(result.ascents).toHaveLength(1)
  })

  it('validates an added training session', () => {
    expect(
      climbingLogFormSchema.safeParse({
        ...generalDetails,
        ascents: [],
        hasTraining: true,
        training: { type: '', intensity: '999' },
      }).success,
    ).toBe(false)
  })

  it('creates a canonical ascent-only log', () => {
    const result = climbingLogFormSchema.parse({
      ...generalDetails,
      ascents: [ascent],
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
      ...generalDetails,
      ascents: [],
      hasTraining: true,
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
      ...generalDetails,
      ascents: [ascent, { ...ascent, discipline: 'Bouldering', name: 'Big Boss' }],
      hasTraining: true,
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
        ...generalDetails,
        ascents: [],
      }).success,
    ).toBe(false)
    expect(
      climbingLogFormSchema.safeParse({
        ...generalDetails,
        ascents: [ascent],
        location: '',
      }).success,
    ).toBe(false)
  })
})
