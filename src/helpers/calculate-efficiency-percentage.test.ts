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
        { id: 1, date: '2023-01-01T10:00:00Z', sessionType: 'Out' },
      ],
    })

    assert.equal(result, 0)
  })

  it('should return 0 when there are no training sessions', () => {
    const result = calculateEfficiencyPercentage({
      ascents: [
        {
          id: 1,
          date: '2023-01-01T11:00:00Z',
          climbingDiscipline: 'Boulder',
          style: 'Flash',
          crag: 'Test Crag',
          topoGrade: '6b',
          routeName: 'Test Route 1',
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
        id: 1,
        date: '2023-01-01T11:00:00Z',
        climbingDiscipline: 'Boulder',
        style: 'Flash',
        crag: 'Test Crag',
        topoGrade: '6b',
        routeName: 'Test Route 1',
        tries: 1,
      },
    ]

    const trainingSessions: TrainingSession[] = [
      { id: 1, date: '2023-01-01T10:00:00Z', sessionType: 'Out' },
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
      value: 1 * COEFFICIENT_ONSIGHT_FLASH_RATIO,
      minimum: 0,
      maximum: 1,
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
      { id: 1, date: '2023-01-01T10:00:00Z', sessionType: 'Out' },
      { id: 2, date: '2023-01-02T10:00:00Z', sessionType: 'Out' },
      { id: 3, date: '2023-01-03T10:00:00Z', sessionType: 'Out' },
    ]

    // 3 ascents on 2 different days
    const ascents: Ascent[] = [
      // Day 1: 2 ascents
      {
        id: 1,
        date: '2023-01-01T11:00:00Z',
        climbingDiscipline: 'Boulder',
        style: 'Flash',
        crag: 'Test Crag',
        topoGrade: '6b',
        routeName: 'Test Route 1',
        tries: 1,
      },
      {
        id: 2,
        date: '2023-01-01T12:00:00Z',
        climbingDiscipline: 'Boulder',
        style: 'Redpoint',
        crag: 'Test Crag',
        topoGrade: '6c',
        routeName: 'Test Route 2',
        tries: 3,
      },
      // Day 2: 1 ascent
      {
        id: 3,
        date: '2023-01-02T11:00:00Z',
        climbingDiscipline: 'Route',
        style: 'Onsight',
        crag: 'Test Crag',
        topoGrade: '6a+',
        routeName: 'Test Route 3',
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
        value: ratio * 100,
        minimum: 0,
        maximum: 100,
      }),
    )
    const expected = Math.round(average(ratios))

    assert.equal(result, expected)
  })

  it('should handle a high efficiency scenario correctly', () => {
    const trainingSessions: TrainingSession[] = [
      { id: 1, date: '2023-01-01T10:00:00Z', sessionType: 'Out' },
      { id: 2, date: '2023-01-02T10:00:00Z', sessionType: 'Out' },
    ]

    // High efficiency: all days with ascents, all onsight/flash, low tries
    const highEfficiencyAscents: Ascent[] = [
      {
        id: 1,
        date: '2023-01-01T11:00:00Z',
        climbingDiscipline: 'Boulder',
        style: 'Onsight',
        crag: 'Test Crag',
        topoGrade: '6b',
        routeName: 'Test Route 1',
        tries: 1,
      },
      {
        id: 2,
        date: '2023-01-01T14:00:00Z',
        climbingDiscipline: 'Boulder',
        style: 'Flash',
        crag: 'Test Crag',
        topoGrade: '6b',
        routeName: 'Test Route 2',
        tries: 1,
      },
      {
        id: 3,
        date: '2023-01-02T11:00:00Z',
        climbingDiscipline: 'Boulder',
        style: 'Onsight',
        crag: 'Test Crag',
        topoGrade: '6b',
        routeName: 'Test Route 3',
        tries: 1,
      },
      {
        id: 4,
        date: '2023-01-02T14:00:00Z',
        climbingDiscipline: 'Boulder',
        style: 'Flash',
        crag: 'Test Crag',
        topoGrade: '6b',
        routeName: 'Test Route 4',
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
        id: 1,
        date: '2023-01-01T11:00:00Z',
        climbingDiscipline: 'Boulder',
        style: 'Redpoint',
        crag: 'Test Crag',
        topoGrade: '6b',
        routeName: 'Test Route 1',
        tries: 8,
      },
      {
        id: 2,
        date: '2023-01-01T14:00:00Z',
        climbingDiscipline: 'Boulder',
        style: 'Redpoint',
        crag: 'Test Crag',
        topoGrade: '6b',
        routeName: 'Test Route 2',
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
      { id: 1, date: '2023-01-01T10:00:00Z', sessionType: 'Out' },
    ]

    const highTriesAscents: Ascent[] = [
      {
        id: 1,
        date: '2023-01-01T11:00:00Z',
        climbingDiscipline: 'Boulder',
        style: 'Redpoint',
        crag: 'Test Crag',
        topoGrade: '6b',
        routeName: 'Test Route 1',
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
      { id: 1, date: '2023-01-01T10:00:00Z', sessionType: 'Out' },
      { id: 2, date: '2023-01-01T12:00:00Z', sessionType: 'Out' },
      { id: 3, date: '2023-01-01T14:00:00Z', sessionType: 'Out' },
    ]

    const ascents: Ascent[] = [
      {
        id: 1,
        date: '2023-01-01T11:00:00Z',
        climbingDiscipline: 'Boulder',
        style: 'Flash',
        crag: 'Test Crag',
        topoGrade: '6b',
        routeName: 'Test Route 1',
        tries: 1,
      },
      {
        id: 2,
        date: '2023-01-01T13:00:00Z',
        climbingDiscipline: 'Boulder',
        style: 'Redpoint',
        crag: 'Test Crag',
        topoGrade: '6c',
        routeName: 'Test Route 2',
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
