import { describe, expect, it } from 'vitest'
import {
  type Ascent,
  BOULDERING,
  FLASH,
  ONSIGHT,
  REDPOINT,
  SPORT,
} from '~/schema/ascent'
import { calculateProgressionPercentage } from './calculate-progression-percentage'

describe('calculateProgressionPercentage', () => {
  it('should return 0 for empty ascents array', () => {
    const result = calculateProgressionPercentage({
      ascents: [],
      year: 2023,
    })
    expect(result).toBe(0)
  })

  it('should return 40% when there are no ascents in the previous year but two in the current year', () => {
    const ascents: Ascent[] = [
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '1',
        name: 'Test Route 1',
        style: REDPOINT,
        grade: '7a',
        tries: 2,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '2',
        name: 'Test Route 2',
        style: ONSIGHT,
        grade: '6c',
        tries: 1,
      } as Ascent,
    ]

    const result = calculateProgressionPercentage({
      ascents,
      year: 2023,
    })
    expect(result).toBe(40)
  })

  it('should return 0 when there are no ascents in the current year', () => {
    const ascents: Ascent[] = [
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '3',
        name: 'Test Route 3',
        style: REDPOINT,
        grade: '7a',
        tries: 2,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '4',
        name: 'Test Route 4',
        style: ONSIGHT,
        grade: '6c',
        tries: 1,
      } as Ascent,
    ]

    const result = calculateProgressionPercentage({
      ascents,
      year: 2023,
    })
    expect(result).toBe(0)
  })

  it('should return 100% when all categories show progression', () => {
    const ascents: Ascent[] = [
      // Previous year ascents
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '5',
        name: 'Boulder Redpoint 2022',
        style: REDPOINT,
        grade: '7a',
        tries: 2,
      } as Ascent,
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '6',
        name: 'Boulder Flash 2022',
        style: FLASH,
        grade: '6c',
        tries: 1,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '7',
        name: 'Route Redpoint 2022',
        style: REDPOINT,
        grade: '7b',
        tries: 2,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '8',
        name: 'Route Flash 2022',
        style: FLASH,
        grade: '7a',
        tries: 1,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '9',
        name: 'Route Onsight 2022',
        style: ONSIGHT,
        grade: '6c+',
        tries: 1,
      } as Ascent,

      // Current year ascents - all harder
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '10',
        name: 'Boulder Redpoint 2023',
        style: REDPOINT,
        grade: '7a+',
        tries: 2,
      } as Ascent,
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '11',
        name: 'Boulder Flash 2023',
        style: FLASH,
        grade: '7a',
        tries: 1,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '12',
        name: 'Route Redpoint 2023',
        style: REDPOINT,
        grade: '7b+',
        tries: 2,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '13',
        name: 'Route Flash 2023',
        style: FLASH,
        grade: '7a+',
        tries: 1,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '14',
        name: 'Route Onsight 2023',
        style: ONSIGHT,
        grade: '7a',
        tries: 1,
      } as Ascent,
    ]

    const result = calculateProgressionPercentage({
      ascents,
      year: 2023,
    })
    expect(result).toBe(100)
  })

  it('should return 60% when 3 out of 5 categories show progression', () => {
    const ascents: Ascent[] = [
      // Previous year ascents
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '15',
        name: 'Boulder Redpoint 2022',
        style: 'Redpoint',
        grade: '7a',
        tries: 2,
      } as Ascent,
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '16',
        name: 'Boulder Flash 2022',
        style: 'Flash',
        grade: '6c',
        tries: 1,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '17',
        name: 'Route Redpoint 2022',
        style: 'Redpoint',
        grade: '7b',
        tries: 2,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '18',
        name: 'Route Flash 2022',
        style: 'Flash',
        grade: '7a',
        tries: 1,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '19',
        name: 'Route Onsight 2022',
        style: 'Onsight',
        grade: '6c+',
        tries: 1,
      } as Ascent,

      // Current year ascents - 3 harder, 2 same
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '20',
        name: 'Boulder Redpoint 2023',
        style: 'Redpoint',
        grade: '7a+', // Better
        tries: 2,
      } as Ascent,
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '21',
        name: 'Boulder Flash 2023',
        style: 'Flash',
        grade: '7a', // Better
        tries: 1,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '22',
        name: 'Route Redpoint 2023',
        style: 'Redpoint',
        grade: '7b', // Same
        tries: 2,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '23',
        name: 'Route Flash 2023',
        style: 'Flash',
        grade: '7a', // Same
        tries: 1,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '24',
        name: 'Route Onsight 2023',
        style: 'Onsight',
        grade: '7a', // Better
        tries: 1,
      } as Ascent,
    ]

    const result = calculateProgressionPercentage({
      ascents,
      year: 2023,
    })
    expect(result).toBe(60)
  })

  it('should return 0% when all categories show regression', () => {
    const ascents: Ascent[] = [
      // Previous year ascents
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '25',
        name: 'Boulder Redpoint 2022',
        style: 'Redpoint',
        grade: '7b',
        tries: 2,
      } as Ascent,
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '26',
        name: 'Boulder Flash 2022',
        style: 'Flash',
        grade: '7a',
        tries: 1,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '27',
        name: 'Route Redpoint 2022',
        style: 'Redpoint',
        grade: '8a',
        tries: 2,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '28',
        name: 'Route Flash 2022',
        style: 'Flash',
        grade: '7b',
        tries: 1,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '29',
        name: 'Route Onsight 2022',
        style: 'Onsight',
        grade: '7a+',
        tries: 1,
      } as Ascent,

      // Current year ascents - all easier
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '30',
        name: 'Boulder Redpoint 2023',
        style: 'Redpoint',
        grade: '7a',
        tries: 2,
      } as Ascent,
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '31',
        name: 'Boulder Flash 2023',
        style: 'Flash',
        grade: '6c',
        tries: 1,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '32',
        name: 'Route Redpoint 2023',
        style: 'Redpoint',
        grade: '7c',
        tries: 2,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '33',
        name: 'Route Flash 2023',
        style: 'Flash',
        grade: '7a',
        tries: 1,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '34',
        name: 'Route Onsight 2023',
        style: 'Onsight',
        grade: '6c',
        tries: 1,
      } as Ascent,
    ]

    const result = calculateProgressionPercentage({
      ascents,
      year: 2023,
    })
    expect(result).toBe(0)
  })

  it('should handle categories with missing data', () => {
    const ascents: Ascent[] = [
      // Previous year - only 3 categories
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '35',
        name: 'Boulder Redpoint 2022',
        style: 'Redpoint',
        grade: '7a',
        tries: 2,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '36',
        name: 'Route Redpoint 2022',
        style: 'Redpoint',
        grade: '7b',
        tries: 2,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '37',
        name: 'Route Onsight 2022',
        style: 'Onsight',
        grade: '6c+',
        tries: 1,
      } as Ascent,

      // Current year - all 5 categories, all better
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '38',
        name: 'Boulder Redpoint 2023',
        style: 'Redpoint',
        grade: '7a+',
        tries: 2,
      } as Ascent,
      {
        discipline: BOULDERING,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '39',
        name: 'Boulder Flash 2023',
        style: 'Flash',
        grade: '7a',
        tries: 1,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '40',
        name: 'Route Redpoint 2023',
        style: 'Redpoint',
        grade: '7b+',
        tries: 2,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '41',
        name: 'Route Flash 2023',
        style: 'Flash',
        grade: '7a',
        tries: 1,
      } as Ascent,
      {
        discipline: SPORT,
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '42',
        name: 'Route Onsight 2023',
        style: 'Onsight',
        grade: '7a',
        tries: 1,
      } as Ascent,
    ]

    // Should show progression only in the 3 categories that have data for both years
    const result = calculateProgressionPercentage({
      ascents,
      year: 2023,
    })
    expect(result).toBe(100)
  })
})
