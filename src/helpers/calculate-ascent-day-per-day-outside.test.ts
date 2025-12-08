import { describe, expect, it } from 'vitest'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { calculateAscentDayPerDayOutside } from './calculate-ascent-day-per-day-outside'

describe('calculateAscentDayPerDayOutside', () => {
  it('should return 0 when there are no outdoor days', () => {
    const ascents: Ascent[] = [
      { date: '2024-01-01' } as Ascent,
      { date: '2024-01-02' } as Ascent,
    ]
    const trainingSessions: TrainingSession[] = []

    const result = calculateAscentDayPerDayOutside(ascents, trainingSessions)

    expect(result).toBe(0)
  })

  it('should return 0 when there are no ascents', () => {
    const ascents: Ascent[] = []
    const trainingSessions: TrainingSession[] = [
      { date: '2024-01-01', sessionType: 'Out' } as TrainingSession,
      { date: '2024-01-02', sessionType: 'Out' } as TrainingSession,
    ]

    const result = calculateAscentDayPerDayOutside(ascents, trainingSessions)

    expect(result).toBe(0)
  })

  it('should calculate ratio when ascent days equal outdoor days', () => {
    const ascents: Ascent[] = [
      { date: '2024-01-01' } as Ascent,
      { date: '2024-01-02' } as Ascent,
    ]
    const trainingSessions: TrainingSession[] = [
      { date: '2024-01-01', sessionType: 'Out' } as TrainingSession,
      { date: '2024-01-02', sessionType: 'Out' } as TrainingSession,
    ]

    const result = calculateAscentDayPerDayOutside(ascents, trainingSessions)

    expect(result).toBe(1)
  })

  it('should calculate ratio when ascent days are less than outdoor days', () => {
    const ascents: Ascent[] = [{ date: '2024-01-01' } as Ascent]
    const trainingSessions: TrainingSession[] = [
      { date: '2024-01-01', sessionType: 'Out' } as TrainingSession,
      { date: '2024-01-02', sessionType: 'Out' } as TrainingSession,
      { date: '2024-01-03', sessionType: 'Out' } as TrainingSession,
    ]

    const result = calculateAscentDayPerDayOutside(ascents, trainingSessions)

    expect(result).toBe(1 / 3)
  })

  it('should handle multiple ascents on the same day', () => {
    const ascents: Ascent[] = [
      { date: '2024-01-01' } as Ascent,
      { date: '2024-01-01' } as Ascent,
      { date: '2024-01-02' } as Ascent,
    ]
    const trainingSessions: TrainingSession[] = [
      { date: '2024-01-01', sessionType: 'Out' } as TrainingSession,
      { date: '2024-01-02', sessionType: 'Out' } as TrainingSession,
    ]

    const result = calculateAscentDayPerDayOutside(ascents, trainingSessions)

    expect(result).toBe(1)
  })

  it('should only count outdoor training sessions', () => {
    const ascents: Ascent[] = [{ date: '2024-01-01' } as Ascent]
    const trainingSessions: TrainingSession[] = [
      { date: '2024-01-01', sessionType: 'Out' } as TrainingSession,
      { date: '2024-01-02', sessionType: 'En' } as TrainingSession,
      { date: '2024-01-03', sessionType: 'En' } as TrainingSession,
    ]

    const result = calculateAscentDayPerDayOutside(ascents, trainingSessions)

    expect(result).toBe(1)
  })
})
