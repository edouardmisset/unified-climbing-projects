import { describe, expect, it } from 'vite-plus/test'
import type { TrainingSession } from '~/schema/training'
import { countOutdoorDays } from './count-outdoor-days'

describe('countOutdoorDays', () => {
  it('returns 0 for empty training sessions', () => {
    const sessions: TrainingSession[] = []
    expect(countOutdoorDays(sessions)).toBe(0)
  })

  it('counts only sessions with type="Outdoor"', () => {
    const sessions: TrainingSession[] = [
      { date: '2024-01-01', type: 'Outdoor' } as TrainingSession,
      { date: '2024-01-02', type: 'Endurance' } as TrainingSession,
      { date: '2024-01-03', type: 'Outdoor' } as TrainingSession,
      { date: '2024-01-04', type: 'Endurance' } as TrainingSession,
    ]
    expect(countOutdoorDays(sessions)).toBe(2)
  })

  it('deduplicates multiple outdoor sessions on the same day', () => {
    const sessions: TrainingSession[] = [
      { date: '2024-01-01', type: 'Outdoor' } as TrainingSession,
      { date: '2024-01-01', type: 'Outdoor' } as TrainingSession,
      { date: '2024-01-02', type: 'Outdoor' } as TrainingSession,
    ]
    expect(countOutdoorDays(sessions)).toBe(2)
  })

  it('deduplicates outdoor sessions with different times on the same day', () => {
    const sessions: TrainingSession[] = [
      { date: '2024-01-01T08:00:00Z', type: 'Outdoor' } as TrainingSession,
      { date: '2024-01-01T23:59:59Z', type: 'Outdoor' } as TrainingSession,
      { date: '2024-01-02', type: 'Outdoor' } as TrainingSession,
    ]
    expect(countOutdoorDays(sessions)).toBe(2)
  })
})
