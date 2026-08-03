import { describe, expect, it } from 'vite-plus/test'
import type { TrainingSession } from '~/schema/training'
import { filterTrainingSessions } from './filter-training'

describe('filterTrainingSessions', () => {
  const trainingSessions = [
    {
      anatomicalRegion: 'Arms',
      discipline: 'Sport',
      comments: 'Good session',
      date: '2023-01-01',
      energySystem: 'Anaerobic Alactic',
      intensity: 100,
      location: 'Gym 1',
      _id: '1',
      type: 'Contact Strength',
      volume: 70,
    },
    {
      anatomicalRegion: 'Fingers',
      discipline: 'Bouldering',
      comments: 'Hard session',
      date: '2023-02-01',
      energySystem: 'Anaerobic Lactic',
      intensity: 80,
      location: 'Crag 1',
      _id: '2',
      type: 'Power Endurance',
      volume: 60,
    },
    {
      anatomicalRegion: 'General',
      discipline: 'Sport',
      comments: 'Easy session',
      date: '2024-01-01',
      energySystem: 'Aerobic',
      intensity: 20,
      location: 'Gym 1',
      _id: '3',
      type: 'Max Strength',
      volume: 80,
    },
  ] satisfies TrainingSession[]

  it('should return all training sessions when no filters are applied', () => {
    const result = filterTrainingSessions(trainingSessions, {})
    expect(result).toStrictEqual(trainingSessions)
  })

  it('should filter training sessions by location', () => {
    const sessions = filterTrainingSessions(trainingSessions, {
      location: 'Gym 1',
    })
    expect(sessions).toHaveLength(2)

    for (const { location } of sessions) expect(location).toBe('Gym 1')
  })

  it('should filter training sessions by discipline', () => {
    const result = filterTrainingSessions(trainingSessions, {
      discipline: 'Bouldering',
    })
    expect(result).toHaveLength(1)
    expect(result[0]?.discipline).toBe('Bouldering')
  })

  it('should filter training sessions by year', () => {
    const result = filterTrainingSessions(trainingSessions, { year: 2_024 })
    expect(result).toHaveLength(1)
    expect(new Date(result[0]?.date ?? '').getFullYear()).toBe(2_024)
  })

  it('should return an empty array when no training sessions match the filters', () => {
    const sessions = filterTrainingSessions(trainingSessions, {
      location: 'This gym does not exist',
    })
    expect(sessions).toStrictEqual([])
  })

  it('should filter training sessions by type', () => {
    const result = filterTrainingSessions(trainingSessions, {
      type: 'Contact Strength',
    })
    expect(result).toHaveLength(1)
    expect(result[0]?.type).toBe('Contact Strength')
  })

  it('should filter training sessions by energySystem', () => {
    const result = filterTrainingSessions(trainingSessions, {
      energySystem: 'Anaerobic Alactic',
    })
    expect(result).toHaveLength(1)
    expect(result[0]?.energySystem).toBe('Anaerobic Alactic')
  })

  it('should filter training sessions by multiple criteria', () => {
    const result = filterTrainingSessions(trainingSessions, {
      location: 'Gym 1',
      type: 'Contact Strength',
    })
    expect(result).toHaveLength(1)
    expect(result[0]?.type).toBe('Contact Strength')
    expect(result[0]?.location).toBe('Gym 1')
  })

  it.each([
    ['High', '1'],
    ['Medium', '2'],
    ['Low', '3'],
  ] as const)('filters %s load sessions', (load, expectedId) => {
    const result = filterTrainingSessions(trainingSessions, { load })

    expect(result.map(({ _id }) => _id)).toStrictEqual([expectedId])
  })
})
