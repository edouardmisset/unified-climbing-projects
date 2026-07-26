import { describe, expect, it } from 'vite-plus/test'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { calculateAscentsPerDay } from './calculate-ascents-per-day'

describe('calculateAscentsPerDay', () => {
  it('should return 0 when there are no outdoor days', () => {
    const ascents: Ascent[] = [{} as Ascent, {} as Ascent, {} as Ascent]
    const trainingSessions: TrainingSession[] = []

    const result = calculateAscentsPerDay(ascents, trainingSessions)

    expect(result).toBe(0)
  })

  it('should return 0 when there are no ascents', () => {
    const ascents: Ascent[] = []
    const trainingSessions: TrainingSession[] = [
      { date: '2024-01-01', type: 'Outdoor' } as TrainingSession,
      { date: '2024-01-02', type: 'Outdoor' } as TrainingSession,
    ]

    const result = calculateAscentsPerDay(ascents, trainingSessions)

    expect(result).toBe(0)
  })

  it('should calculate ascents per day', () => {
    const ascents: Ascent[] = [{} as Ascent, {} as Ascent, {} as Ascent, {} as Ascent, {} as Ascent]
    const trainingSessions: TrainingSession[] = [
      { date: '2024-01-01', type: 'Outdoor' } as TrainingSession,
      { date: '2024-01-02', type: 'Outdoor' } as TrainingSession,
    ]

    const result = calculateAscentsPerDay(ascents, trainingSessions)
    const expected = 5 / 2

    expect(result).toBe(expected)
  })

  it('should only count outdoor training sessions', () => {
    const ascents: Ascent[] = [{} as Ascent, {} as Ascent]
    const trainingSessions: TrainingSession[] = [
      { date: '2024-01-01', type: 'Outdoor' } as TrainingSession,
      { date: '2024-01-02', type: 'Endurance' } as TrainingSession,
      { date: '2024-01-03', type: 'Endurance' } as TrainingSession,
    ]

    const result = calculateAscentsPerDay(ascents, trainingSessions)
    const expected = 2 / 1

    expect(result).toBe(expected)
  })

  it('should handle fractional results', () => {
    const ascents: Ascent[] = [{} as Ascent, {} as Ascent, {} as Ascent]
    const trainingSessions: TrainingSession[] = [
      { date: '2024-01-01', type: 'Outdoor' } as TrainingSession,
      { date: '2024-01-02', type: 'Outdoor' } as TrainingSession,
    ]

    const result = calculateAscentsPerDay(ascents, trainingSessions)
    const expected = 3 / 2

    expect(result).toBe(expected)
  })
})
