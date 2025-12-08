import { describe, expect, it } from 'vitest'
import type { Ascent } from '~/schema/ascent'
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
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '1',
        routeName: 'Test Route 1',
        style: 'Redpoint',
        topoGrade: '7a',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '2',
        routeName: 'Test Route 2',
        style: 'Onsight',
        topoGrade: '6c',
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
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '3',
        routeName: 'Test Route 3',
        style: 'Redpoint',
        topoGrade: '7a',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '4',
        routeName: 'Test Route 4',
        style: 'Onsight',
        topoGrade: '6c',
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
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '5',
        routeName: 'Boulder Redpoint 2022',
        style: 'Redpoint',
        topoGrade: '7a',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '6',
        routeName: 'Boulder Flash 2022',
        style: 'Flash',
        topoGrade: '6c',
        tries: 1,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '7',
        routeName: 'Route Redpoint 2022',
        style: 'Redpoint',
        topoGrade: '7b',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '8',
        routeName: 'Route Flash 2022',
        style: 'Flash',
        topoGrade: '7a',
        tries: 1,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '9',
        routeName: 'Route Onsight 2022',
        style: 'Onsight',
        topoGrade: '6c+',
        tries: 1,
      } as Ascent,

      // Current year ascents - all harder
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '10',
        routeName: 'Boulder Redpoint 2023',
        style: 'Redpoint',
        topoGrade: '7a+',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '11',
        routeName: 'Boulder Flash 2023',
        style: 'Flash',
        topoGrade: '7a',
        tries: 1,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '12',
        routeName: 'Route Redpoint 2023',
        style: 'Redpoint',
        topoGrade: '7b+',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '13',
        routeName: 'Route Flash 2023',
        style: 'Flash',
        topoGrade: '7a+',
        tries: 1,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '14',
        routeName: 'Route Onsight 2023',
        style: 'Onsight',
        topoGrade: '7a',
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
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '15',
        routeName: 'Boulder Redpoint 2022',
        style: 'Redpoint',
        topoGrade: '7a',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '16',
        routeName: 'Boulder Flash 2022',
        style: 'Flash',
        topoGrade: '6c',
        tries: 1,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '17',
        routeName: 'Route Redpoint 2022',
        style: 'Redpoint',
        topoGrade: '7b',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '18',
        routeName: 'Route Flash 2022',
        style: 'Flash',
        topoGrade: '7a',
        tries: 1,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '19',
        routeName: 'Route Onsight 2022',
        style: 'Onsight',
        topoGrade: '6c+',
        tries: 1,
      } as Ascent,

      // Current year ascents - 3 harder, 2 same
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '20',
        routeName: 'Boulder Redpoint 2023',
        style: 'Redpoint',
        topoGrade: '7a+', // Better
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '21',
        routeName: 'Boulder Flash 2023',
        style: 'Flash',
        topoGrade: '7a', // Better
        tries: 1,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '22',
        routeName: 'Route Redpoint 2023',
        style: 'Redpoint',
        topoGrade: '7b', // Same
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '23',
        routeName: 'Route Flash 2023',
        style: 'Flash',
        topoGrade: '7a', // Same
        tries: 1,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '24',
        routeName: 'Route Onsight 2023',
        style: 'Onsight',
        topoGrade: '7a', // Better
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
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '25',
        routeName: 'Boulder Redpoint 2022',
        style: 'Redpoint',
        topoGrade: '7b',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '26',
        routeName: 'Boulder Flash 2022',
        style: 'Flash',
        topoGrade: '7a',
        tries: 1,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '27',
        routeName: 'Route Redpoint 2022',
        style: 'Redpoint',
        topoGrade: '8a',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '28',
        routeName: 'Route Flash 2022',
        style: 'Flash',
        topoGrade: '7b',
        tries: 1,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '29',
        routeName: 'Route Onsight 2022',
        style: 'Onsight',
        topoGrade: '7a+',
        tries: 1,
      } as Ascent,

      // Current year ascents - all easier
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '30',
        routeName: 'Boulder Redpoint 2023',
        style: 'Redpoint',
        topoGrade: '7a',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '31',
        routeName: 'Boulder Flash 2023',
        style: 'Flash',
        topoGrade: '6c',
        tries: 1,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '32',
        routeName: 'Route Redpoint 2023',
        style: 'Redpoint',
        topoGrade: '7c',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '33',
        routeName: 'Route Flash 2023',
        style: 'Flash',
        topoGrade: '7a',
        tries: 1,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '34',
        routeName: 'Route Onsight 2023',
        style: 'Onsight',
        topoGrade: '6c',
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
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '35',
        routeName: 'Boulder Redpoint 2022',
        style: 'Redpoint',
        topoGrade: '7a',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '36',
        routeName: 'Route Redpoint 2022',
        style: 'Redpoint',
        topoGrade: '7b',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2022-06-15T12:00:00.000Z',
        _id: '37',
        routeName: 'Route Onsight 2022',
        style: 'Onsight',
        topoGrade: '6c+',
        tries: 1,
      } as Ascent,

      // Current year - all 5 categories, all better
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '38',
        routeName: 'Boulder Redpoint 2023',
        style: 'Redpoint',
        topoGrade: '7a+',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Boulder',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '39',
        routeName: 'Boulder Flash 2023',
        style: 'Flash',
        topoGrade: '7a',
        tries: 1,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '40',
        routeName: 'Route Redpoint 2023',
        style: 'Redpoint',
        topoGrade: '7b+',
        tries: 2,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '41',
        routeName: 'Route Flash 2023',
        style: 'Flash',
        topoGrade: '7a',
        tries: 1,
      } as Ascent,
      {
        climbingDiscipline: 'Route',
        crag: 'Test Crag',
        date: '2023-06-15T12:00:00.000Z',
        _id: '42',
        routeName: 'Route Onsight 2023',
        style: 'Onsight',
        topoGrade: '7a',
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
