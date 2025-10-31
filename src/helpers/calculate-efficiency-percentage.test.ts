import { average, clampValueInRange } from '@edouardmisset/math'
import { describe, expect, it } from 'vitest'
import {
  COEFFICIENT_ASCENTS_PER_DAY,
  COEFFICIENT_ONSIGHT_FLASH_RATIO,
} from '~/constants/ascents'
import type { Ascent } from '~/schema/ascent'
import { OUTDOOR, type TrainingSession } from '~/schema/training'
import { calculateEfficiencyPercentage } from './calculate-efficiency-percentage'

describe('calculateEfficiencyPercentage', () => {
  it('should return 0 when there are no ascents', () => {
    const result = calculateEfficiencyPercentage({
      ascents: [],
      trainingSessions: [
        { date: '2023-01-01T10:00:00Z', _id: '1', type: OUTDOOR },
      ],
    })

    expect(result).toBe(0)
  })

  it('should return 0 when there are no training sessions', () => {
    const result = calculateEfficiencyPercentage({
      ascents: [
        {
          discipline: 'Bouldering',
          crag: 'Test Crag',
          date: '2023-01-01T11:00:00Z',
          _id: '1',
          name: 'Test Route 1',
          style: 'Flash',
          grade: '6b',
          tries: 1,
        },
      ],
      trainingSessions: [],
    })

    expect(result).toBe(0)
  })

  it('should calculate efficiency percentage correctly for a simple case', () => {
    // Scenario: 1 day outside, 1 ascent Flash, 1 try
    const ascents: Ascent[] = [
      {
        discipline: 'Bouldering',
        crag: 'Test Crag',
        date: '2023-01-01T11:00:00Z',
        _id: '1',
        name: 'Test Route 1',
        style: 'Flash',
        grade: '6b',
        tries: 1,
      },
    ]

    const trainingSessions: TrainingSession[] = [
      { date: '2023-01-01T10:00:00Z', _id: '1', type: OUTDOOR },
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

    expect(result).toBe(expected)
  })

  it('should handle multiple days and ascents correctly', () => {
    // 3 different days outside
    const trainingSessions: TrainingSession[] = [
      { date: '2023-01-01T10:00:00Z', _id: '1', type: OUTDOOR },
      { date: '2023-01-02T10:00:00Z', _id: '2', type: OUTDOOR },
      { date: '2023-01-03T10:00:00Z', _id: '3', type: OUTDOOR },
    ]

    // 3 ascents on 2 different days
    const ascents: Ascent[] = [
      // Day 1: 2 ascents
      {
        discipline: 'Bouldering',
        crag: 'Test Crag',
        date: '2023-01-01T11:00:00Z',
        _id: '1',
        name: 'Test Route 1',
        style: 'Flash',
        grade: '6b',
        tries: 1,
      },
      {
        discipline: 'Bouldering',
        crag: 'Test Crag',
        date: '2023-01-01T12:00:00Z',
        _id: '2',
        name: 'Test Route 2',
        style: 'Redpoint',
        grade: '6c',
        tries: 3,
      },
      // Day 2: 1 ascent
      {
        discipline: 'Sport',
        crag: 'Test Crag',
        date: '2023-01-02T11:00:00Z',
        _id: '3',
        name: 'Test Route 3',
        style: 'Onsight',
        grade: '6a+',
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

    expect(result).toBe(expected)
  })

  it('should handle a high efficiency scenario correctly', () => {
    const trainingSessions: TrainingSession[] = [
      { date: '2023-01-01T10:00:00Z', _id: '1', type: OUTDOOR },
      { date: '2023-01-02T10:00:00Z', _id: '2', type: OUTDOOR },
    ]

    // High efficiency: all days with ascents, all onsight/flash, low tries
    const highEfficiencyAscents: Ascent[] = [
      {
        discipline: 'Bouldering',
        crag: 'Test Crag',
        date: '2023-01-01T11:00:00Z',
        _id: '1',
        name: 'Test Route 1',
        style: 'Onsight',
        grade: '6b',
        tries: 1,
      },
      {
        discipline: 'Bouldering',
        crag: 'Test Crag',
        date: '2023-01-01T14:00:00Z',
        _id: '2',
        name: 'Test Route 2',
        style: 'Flash',
        grade: '6b',
        tries: 1,
      },
      {
        discipline: 'Bouldering',
        crag: 'Test Crag',
        date: '2023-01-02T11:00:00Z',
        _id: '3',
        name: 'Test Route 3',
        style: 'Onsight',
        grade: '6b',
        tries: 1,
      },
      {
        discipline: 'Bouldering',
        crag: 'Test Crag',
        date: '2023-01-02T14:00:00Z',
        _id: '4',
        name: 'Test Route 4',
        style: 'Flash',
        grade: '6b',
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
        discipline: 'Bouldering',
        crag: 'Test Crag',
        date: '2023-01-01T11:00:00Z',
        _id: '1',
        name: 'Test Route 1',
        style: 'Redpoint',
        grade: '6b',
        tries: 8,
      },
      {
        discipline: 'Bouldering',
        crag: 'Test Crag',
        date: '2023-01-01T14:00:00Z',
        _id: '2',
        name: 'Test Route 2',
        style: 'Redpoint',
        grade: '6b',
        tries: 10,
      },
    ]

    const lowEfficiencyResult = calculateEfficiencyPercentage({
      ascents: lowEfficiencyAscents,
      trainingSessions,
    })

    // High efficiency scenario should have a higher result
    expect(highEfficiencyResult).toBeGreaterThan(lowEfficiencyResult)
  })

  it('should handle edge case with very high number of tries', () => {
    const trainingSessions: TrainingSession[] = [
      { date: '2023-01-01T10:00:00Z', _id: '1', type: OUTDOOR },
    ]

    const highTriesAscents: Ascent[] = [
      {
        discipline: 'Bouldering',
        crag: 'Test Crag',
        date: '2023-01-01T11:00:00Z',
        _id: '1',
        name: 'Test Route 1',
        style: 'Redpoint',
        grade: '6b',
        tries: 100, // Extreme case
      },
    ]

    const result = calculateEfficiencyPercentage({
      ascents: highTriesAscents,
      trainingSessions,
    })

    // Should still return a valid percentage
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(100)
  })

  it('should handle multiple days but same date ascents correctly', () => {
    // 3 different training session days but only 1 unique date
    const trainingSessions: TrainingSession[] = [
      { date: '2023-01-01T10:00:00Z', _id: '1', type: OUTDOOR },
      { date: '2023-01-01T12:00:00Z', _id: '2', type: OUTDOOR },
      { date: '2023-01-01T14:00:00Z', _id: '3', type: OUTDOOR },
    ]

    const ascents: Ascent[] = [
      {
        discipline: 'Bouldering',
        crag: 'Test Crag',
        date: '2023-01-01T11:00:00Z',
        _id: '1',
        name: 'Test Route 1',
        style: 'Flash',
        grade: '6b',
        tries: 1,
      },
      {
        discipline: 'Bouldering',
        crag: 'Test Crag',
        date: '2023-01-01T13:00:00Z',
        _id: '2',
        name: 'Test Route 2',
        style: 'Redpoint',
        grade: '6c',
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

    expect(result).toBe(expected)
  })
})
