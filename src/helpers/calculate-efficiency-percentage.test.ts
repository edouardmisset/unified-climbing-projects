import { average, clampValueInRange } from '@edouardmisset/math'
import { assert, describe, it } from 'poku'
import {
  COEFFICIENT_ASCENTS_PER_DAY,
  COEFFICIENT_ONSIGHT_FLASH_RATIO,
} from '~/constants/ascents'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { calculateEfficiencyPercentage } from './calculate-efficiency-percentage'

describe('calculateEfficiencyPercentage', () => {
  it('should return 0 when there are no ascents', () => {
    const result = calculateEfficiencyPercentage({
      ascents: [],
      trainingSessions: [
        { date: '2023-01-01T10:00:00Z', _id: '1', sessionType: 'Out' },
      ],
    })

    assert.equal(result, 0)
  })

  it('should return 0 when there are no training sessions', () => {
    const result = calculateEfficiencyPercentage({
      ascents: [
        {
          climbingDiscipline: 'Boulder',
          crag: 'Test Crag',
          date: '2023-01-01T11:00:00Z',
          _id: '1',
          routeName: 'Test Route 1',
          style: 'Flash',
          topoGrade: '6b',
          tries: 1,
        },
      ],
      trainingSessions: [],
    })

    assert.equal(result, 0)
  })

  it('should calculate efficiency percentage correctly for a simple case', () => {
    // Scenario: 1 day outside, 1 ascent Flash, 1 try
    const ascents: Ascent[] = [
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-01-01T11:00:00Z',
        _id: '1',
        routeName: 'Test Route 1',
        style: 'Flash',
        topoGrade: '6b',
        tries: 1,
      },
    ]

    const trainingSessions: TrainingSession[] = [
      { date: '2023-01-01T10:00:00Z', _id: '1', sessionType: 'Out' },
    ]

    const result = calculateEfficiencyPercentage({
      ascents,
      trainingSessions,
    })

    // Calculate expected result manually
    const ascentDayPerDayOutside = 1
    const ascentsPerDay = 1 * COEFFICIENT_ASCENTS_PER_DAY
    const averageTries = 1
    const onsightFlashRatio = clampValueInRange({
      maximum: 1,
      minimum: 0,
      value: 1 * COEFFICIENT_ONSIGHT_FLASH_RATIO,
    })
    const expected = Math.round(
      average(
        ascentDayPerDayOutside,
        ascentsPerDay,
        averageTries,
        onsightFlashRatio,
      ) * 100,
    )

    assert.equal(result, expected)
  })

  it('should handle multiple days and ascents correctly', () => {
    // 3 different days outside
    const trainingSessions: TrainingSession[] = [
      { date: '2023-01-01T10:00:00Z', _id: '1', sessionType: 'Out' },
      { date: '2023-01-02T10:00:00Z', _id: '2', sessionType: 'Out' },
      { date: '2023-01-03T10:00:00Z', _id: '3', sessionType: 'Out' },
    ]

    // 3 ascents on 2 different days
    const ascents: Ascent[] = [
      // Day 1: 2 ascents
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-01-01T11:00:00Z',
        _id: '1',
        routeName: 'Test Route 1',
        style: 'Flash',
        topoGrade: '6b',
        tries: 1,
      },
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-01-01T12:00:00Z',
        _id: '2',
        routeName: 'Test Route 2',
        style: 'Redpoint',
        topoGrade: '6c',
        tries: 3,
      },
      // Day 2: 1 ascent
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2023-01-02T11:00:00Z',
        _id: '3',
        routeName: 'Test Route 3',
        style: 'Onsight',
        topoGrade: '6a+',
        tries: 1,
      },
    ]

    const result = calculateEfficiencyPercentage({
      ascents,
      trainingSessions,
    })

    const ascentDayPerDayOutside = 2 / 3
    const ascentsPerDay = (3 / 3) * COEFFICIENT_ASCENTS_PER_DAY
    const averageTries = 3 / (1 + 3 + 1)
    const onsightFlashRatio = (2 / 3) * COEFFICIENT_ONSIGHT_FLASH_RATIO

    const ratios = [
      ascentDayPerDayOutside,
      ascentsPerDay,
      averageTries,
      onsightFlashRatio,
    ].map(ratio =>
      clampValueInRange({
        maximum: 100,
        minimum: 0,
        value: ratio * 100,
      }),
    )
    const expected = Math.round(average(ratios))

    assert.equal(result, expected)
  })

  it('should handle a high efficiency scenario correctly', () => {
    const trainingSessions: TrainingSession[] = [
      { date: '2023-01-01T10:00:00Z', _id: '1', sessionType: 'Out' },
      { date: '2023-01-02T10:00:00Z', _id: '2', sessionType: 'Out' },
    ]

    // High efficiency: all days with ascents, all onsight/flash, low tries
    const highEfficiencyAscents: Ascent[] = [
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-01-01T11:00:00Z',
        _id: '1',
        routeName: 'Test Route 1',
        style: 'Onsight',
        topoGrade: '6b',
        tries: 1,
      },
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-01-01T14:00:00Z',
        _id: '2',
        routeName: 'Test Route 2',
        style: 'Flash',
        topoGrade: '6b',
        tries: 1,
      },
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-01-02T11:00:00Z',
        _id: '3',
        routeName: 'Test Route 3',
        style: 'Onsight',
        topoGrade: '6b',
        tries: 1,
      },
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-01-02T14:00:00Z',
        _id: '4',
        routeName: 'Test Route 4',
        style: 'Flash',
        topoGrade: '6b',
        tries: 1,
      },
    ]

    const highEfficiencyResult = calculateEfficiencyPercentage({
      ascents: highEfficiencyAscents,
      trainingSessions,
    })

    // Low efficiency: fewer days with ascents, all redpoint, high tries
    const lowEfficiencyAscents: Ascent[] = [
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-01-01T11:00:00Z',
        _id: '1',
        routeName: 'Test Route 1',
        style: 'Redpoint',
        topoGrade: '6b',
        tries: 8,
      },
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-01-01T14:00:00Z',
        _id: '2',
        routeName: 'Test Route 2',
        style: 'Redpoint',
        topoGrade: '6b',
        tries: 10,
      },
    ]

    const lowEfficiencyResult = calculateEfficiencyPercentage({
      ascents: lowEfficiencyAscents,
      trainingSessions,
    })

    // High efficiency scenario should have a higher result
    assert.ok(
      highEfficiencyResult > lowEfficiencyResult,
      `Expected ${highEfficiencyResult} to be greater than ${lowEfficiencyResult}`,
    )
  })

  it('should handle edge case with very high number of tries', () => {
    const trainingSessions: TrainingSession[] = [
      { date: '2023-01-01T10:00:00Z', _id: '1', sessionType: 'Out' },
    ]

    const highTriesAscents: Ascent[] = [
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-01-01T11:00:00Z',
        _id: '1',
        routeName: 'Test Route 1',
        style: 'Redpoint',
        topoGrade: '6b',
        tries: 100, // Extreme case
      },
    ]

    const result = calculateEfficiencyPercentage({
      ascents: highTriesAscents,
      trainingSessions,
    })

    // Should still return a valid percentage
    assert.ok(
      result >= 0,
      `Expected ${result} to be greater than or equal to 0`,
    )
    assert.ok(
      result <= 100,
      `Expected ${result} to be less than or equal to 100`,
    )
  })

  it('should handle multiple days but same date ascents correctly', () => {
    // 3 different training session days but only 1 unique date
    const trainingSessions: TrainingSession[] = [
      { date: '2023-01-01T10:00:00Z', _id: '1', sessionType: 'Out' },
      { date: '2023-01-01T12:00:00Z', _id: '2', sessionType: 'Out' },
      { date: '2023-01-01T14:00:00Z', _id: '3', sessionType: 'Out' },
    ]

    const ascents: Ascent[] = [
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-01-01T11:00:00Z',
        _id: '1',
        routeName: 'Test Route 1',
        style: 'Flash',
        topoGrade: '6b',
        tries: 1,
      },
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-01-01T13:00:00Z',
        _id: '2',
        routeName: 'Test Route 2',
        style: 'Redpoint',
        topoGrade: '6c',
        tries: 3,
      },
    ]

    const result = calculateEfficiencyPercentage({
      ascents,
      trainingSessions,
    })

    // Calculate expected result manually
    // Only 1 unique day
    const ascentDayPerDayOutside = 1
    const ascentsPerDay = 2 * COEFFICIENT_ASCENTS_PER_DAY
    const averageTries = 2 / (1 + 3)
    const onsightFlashRatio = (1 / 2) * COEFFICIENT_ONSIGHT_FLASH_RATIO

    const expected = Math.round(
      average(
        ascentDayPerDayOutside,
        ascentsPerDay,
        averageTries,
        onsightFlashRatio,
      ) * 100,
    )

    assert.equal(result, expected)
  })
})
