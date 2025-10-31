import { describe, expect, it } from 'vitest'
import { OUTDOOR, type TrainingSession } from '~/schema/training'
import { countOutdoorDays } from './count-outdoor-days'

describe('countOutdoorDays', () => {
  it('returns 0 for empty training sessions', () => {
    const sessions: TrainingSession[] = []
    expect(countOutdoorDays(sessions)).toBe(0)
  })

  it('counts only sessions with sessionType="Out"', () => {
    const sessions: TrainingSession[] = [
      { date: '2024-01-01', _id: '1', type: OUTDOOR } as TrainingSession,
      { date: '2024-01-02', _id: '2', type: 'Endurance' } as TrainingSession,
      { date: '2024-01-03', _id: '3', type: OUTDOOR } as TrainingSession,
      { date: '2024-01-04', _id: '4', type: 'Endurance' } as TrainingSession,
    ]
    expect(countOutdoorDays(sessions)).toBe(2)
  })

  it('deduplicates multiple outdoor sessions on the same day', () => {
    const sessions: TrainingSession[] = [
      { date: '2024-01-01', _id: '1', type: OUTDOOR } as TrainingSession,
      { date: '2024-01-01', _id: '2', type: OUTDOOR } as TrainingSession,
      { date: '2024-01-02', _id: '3', type: OUTDOOR } as TrainingSession,
    ]
    expect(countOutdoorDays(sessions)).toBe(2)
  })

  it('deduplicates outdoor sessions with different times on the same day', () => {
    const sessions: TrainingSession[] = [
      {
        date: '2024-01-01T08:00:00Z',
        _id: '1',
        type: OUTDOOR,
      } as TrainingSession,
      {
        date: '2024-01-01T23:59:59Z',
        _id: '2',
        type: OUTDOOR,
      } as TrainingSession,
      { date: '2024-01-02', _id: '3', type: OUTDOOR } as TrainingSession,
    ]
    expect(countOutdoorDays(sessions)).toBe(2)
  })
})
