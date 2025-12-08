import { describe, expect, it } from 'vitest'
import type { TrainingSession } from '~/schema/training'
import { countOutdoorDays } from './count-outdoor-days'

describe('countOutdoorDays', () => {
  it('returns 0 for empty training sessions', () => {
    const sessions: TrainingSession[] = []
    expect(countOutdoorDays(sessions)).toBe(0)
  })

  it('counts only sessions with sessionType="Out"', () => {
    const sessions: TrainingSession[] = [
      { date: '2024-01-01', sessionType: 'Out' } as TrainingSession,
      { date: '2024-01-02', sessionType: 'En' } as TrainingSession,
      { date: '2024-01-03', sessionType: 'Out' } as TrainingSession,
      { date: '2024-01-04', sessionType: 'En' } as TrainingSession,
    ]
    expect(countOutdoorDays(sessions)).toBe(2)
  })

  it('deduplicates multiple outdoor sessions on the same day', () => {
    const sessions: TrainingSession[] = [
      { date: '2024-01-01', sessionType: 'Out' } as TrainingSession,
      { date: '2024-01-01', sessionType: 'Out' } as TrainingSession,
      { date: '2024-01-02', sessionType: 'Out' } as TrainingSession,
    ]
    expect(countOutdoorDays(sessions)).toBe(2)
  })

  it('deduplicates outdoor sessions with different times on the same day', () => {
    const sessions: TrainingSession[] = [
      { date: '2024-01-01T08:00:00Z', sessionType: 'Out' } as TrainingSession,
      { date: '2024-01-01T23:59:59Z', sessionType: 'Out' } as TrainingSession,
      { date: '2024-01-02', sessionType: 'Out' } as TrainingSession,
    ]
    expect(countOutdoorDays(sessions)).toBe(2)
  })
})
