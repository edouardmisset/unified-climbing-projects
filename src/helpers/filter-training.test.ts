import { assert, describe, it } from 'poku'
import type { TrainingSession } from '~/schema/training'
import { filterTrainingSessions } from './filter-training'

describe('filterTrainingSessions', () => {
  const trainingSessions = [
    {
      anatomicalRegion: 'Ar',
      climbingDiscipline: 'Route',
      comments: 'Good session',
      date: '2023-01-01',
      energySystem: 'AA',
      gymCrag: 'Gym 1',
      _id: '1',
      sessionType: 'CS',
      volume: 70,
    },
    {
      anatomicalRegion: 'Fi',
      climbingDiscipline: 'Boulder',
      comments: 'Hard session',
      date: '2023-02-01',
      energySystem: 'AL',
      gymCrag: 'Crag 1',
      _id: '2',
      sessionType: 'PE',
      volume: 60,
    },
    {
      anatomicalRegion: 'Ge',
      climbingDiscipline: 'Route',
      comments: 'Easy session',
      date: '2024-01-01',
      energySystem: 'AE',
      gymCrag: 'Gym 1',
      _id: '3',
      sessionType: 'MS',
      volume: 80,
    },
  ] satisfies TrainingSession[]

  it('should return all training sessions when no filters are applied', () => {
    const result = filterTrainingSessions(trainingSessions, {})
    assert.deepEqual(result, trainingSessions)
  })

  it('should filter training sessions by gymCrag', () => {
    const sessions = filterTrainingSessions(trainingSessions, {
      gymCrag: 'Gym 1',
    })
    assert.equal(sessions.length, 2)

    for (const { gymCrag } of sessions) {
      assert.equal(gymCrag, 'Gym 1')
    }
  })

  it('should filter training sessions by climbingDiscipline', () => {
    const result = filterTrainingSessions(trainingSessions, {
      climbingDiscipline: 'Boulder',
    })
    assert.equal(result.length, 1)
    assert.equal(result[0]?.climbingDiscipline, 'Boulder')
  })

  it('should filter training sessions by year', () => {
    const result = filterTrainingSessions(trainingSessions, { year: 2024 })
    assert.equal(result.length, 1)
    if (result[0]) {
      assert.equal(new Date(result[0].date).getFullYear(), 2024)
    } else {
      throw new Error('result[0] is undefined')
    }
  })

  it('should return an empty array when no training sessions match the filters', () => {
    const sessions = filterTrainingSessions(trainingSessions, {
      gymCrag: 'This gym does not exist',
    })
    assert.deepEqual(sessions, [])
  })

  it('should filter training sessions by sessionType', () => {
    const result = filterTrainingSessions(trainingSessions, {
      sessionType: 'CS',
    })
    assert.equal(result.length, 1)
    assert.equal(result[0]?.sessionType, 'CS')
  })

  it('should filter training sessions by energySystem', () => {
    const result = filterTrainingSessions(trainingSessions, {
      energySystem: 'AA',
    })
    assert.equal(result.length, 1)
    assert.equal(result[0]?.energySystem, 'AA')
  })

  it('should filter training sessions by multiple criteria', () => {
    const result = filterTrainingSessions(trainingSessions, {
      gymCrag: 'Gym 1',
      sessionType: 'CS',
    })
    assert.equal(result.length, 1)
    assert.equal(result[0]?.sessionType, 'CS')
    assert.equal(result[0]?.gymCrag, 'Gym 1')
  })
})
