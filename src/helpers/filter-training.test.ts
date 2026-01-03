import { describe, expect, it } from 'vitest'
import { BOULDERING, SPORT } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { filterTrainingSessions } from './filter-training'

describe('filterTrainingSessions', () => {
  const trainingSessions = [
    {
      anatomicalRegion: 'Arms',
      discipline: SPORT,
      comments: 'Good session',
      date: '2023-01-01',
      energySystem: 'Anaerobic Alactic',
      location: 'Gym 1',
      _id: '1',
      type: 'Contact Strength',
      volume: 70,
    },
    {
      anatomicalRegion: 'Fingers',
      discipline: BOULDERING,
      comments: 'Hard session',
      date: '2023-02-01',
      energySystem: 'Anaerobic Lactic',
      location: 'Crag 1',
      _id: '2',
      type: 'Power Endurance',
      volume: 60,
    },
    {
      anatomicalRegion: 'General',
      discipline: SPORT,
      comments: 'Easy session',
      date: '2024-01-01',
      energySystem: 'Aerobic',
      location: 'Gym 1',
      _id: '3',
      type: 'Max Strength',
      volume: 80,
    },
  ] satisfies TrainingSession[]

  it('should return all training sessions when no filters are applied', () => {
    const result = filterTrainingSessions(trainingSessions, {})
    expect(result).toEqual(trainingSessions)
  })

  it('should filter training sessions by gymCrag', () => {
    const sessions = filterTrainingSessions(trainingSessions, {
      location: 'Gym 1',
    })
    expect(sessions.length).toBe(2)

    for (const { location: gymCrag } of sessions) {
      expect(gymCrag).toBe('Gym 1')
    }
  })

  it('should filter training sessions by discipline', () => {
    const result = filterTrainingSessions(trainingSessions, {
      discipline: BOULDERING,
    })
    expect(result.length).toBe(1)
    expect(result[0]?.discipline).toBe(BOULDERING)
  })

  it('should filter training sessions by year', () => {
    const result = filterTrainingSessions(trainingSessions, { year: 2024 })
    expect(result.length).toBe(1)
    if (result[0]) {
      expect(new Date(result[0].date).getFullYear()).toBe(2024)
    } else {
      throw new Error('result[0] is undefined')
    }
  })

  it('should return an empty array when no training sessions match the filters', () => {
    const sessions = filterTrainingSessions(trainingSessions, {
      location: 'This gym does not exist',
    })
    expect(sessions).toEqual([])
  })

  it('should filter training sessions by sessionType', () => {
    const result = filterTrainingSessions(trainingSessions, {
      type: 'Contact Strength',
    })
    expect(result.length).toBe(1)
    expect(result[0]?.type).toBe('Contact Strength')
  })

  it('should filter training sessions by energySystem', () => {
    const result = filterTrainingSessions(trainingSessions, {
      energySystem: 'Anaerobic Alactic',
    })
    expect(result.length).toBe(1)
    expect(result[0]?.energySystem).toBe('Anaerobic Alactic')
  })

  it('should filter training sessions by multiple criteria', () => {
    const result = filterTrainingSessions(trainingSessions, {
      location: 'Gym 1',
      type: 'Contact Strength',
    })
    expect(result.length).toBe(1)
    expect(result[0]?.type).toBe('Contact Strength')
    expect(result[0]?.location).toBe('Gym 1')
  })
})
