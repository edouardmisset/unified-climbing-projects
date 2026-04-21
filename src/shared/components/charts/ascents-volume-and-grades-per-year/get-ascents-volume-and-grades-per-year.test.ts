import { describe, expect, it } from 'vitest'
import { sampleAscents } from '~/backup/sample-ascents'
import { fromGradeToNumber } from '~/ascents/helpers/grade-converter'
import type { Ascent } from '~/ascents/schema'
import { getAscentsVolumeAndGradesPerYear } from './get-ascents-volume-and-grades-per-year'

describe('getAscentsVolumeAndGradesPerYear', () => {
  it('should return empty array for empty input', () => {
    const result = getAscentsVolumeAndGradesPerYear([])
    expect(result).toEqual([])
  })

  it('should return yearly discipline counts with max and average grades', () => {
    const [firstAscent, secondAscent, thirdAscent, fourthAscent, fifthAscent] = sampleAscents

    if (!firstAscent || !secondAscent || !thirdAscent || !fourthAscent || !fifthAscent)
      throw new Error('Expected at least five sample ascents')

    const ascents: Ascent[] = [
      {
        ...firstAscent,
        _id: 'volume-and-grade-1',
        climbingDiscipline: 'Route',
        date: '2023-01-10',
        topoGrade: '6a',
      },
      {
        ...secondAscent,
        _id: 'volume-and-grade-2',
        climbingDiscipline: 'Route',
        date: '2023-05-08',
        topoGrade: '6b',
      },
      {
        ...thirdAscent,
        _id: 'volume-and-grade-3',
        climbingDiscipline: 'Boulder',
        date: '2023-08-02',
        topoGrade: '7a',
      },
      {
        ...fourthAscent,
        _id: 'volume-and-grade-4',
        climbingDiscipline: 'Boulder',
        date: '2025-03-17',
        topoGrade: '7b+',
      },
      {
        ...fifthAscent,
        _id: 'volume-and-grade-5',
        climbingDiscipline: 'Multi-Pitch',
        date: '2025-09-13',
        topoGrade: '8a',
      },
    ]

    const result = getAscentsVolumeAndGradesPerYear(ascents)

    expect(result).toEqual([
      {
        Boulder: 1,
        Route: 2,
        avgBoulderGrade: fromGradeToNumber('7a'),
        avgRouteGrade: fromGradeToNumber('6a+'),
        maxBoulderGrade: fromGradeToNumber('7a'),
        maxRouteGrade: fromGradeToNumber('6b'),
        year: 2_023,
      },
      {
        Boulder: 0,
        Route: 0,
        avgBoulderGrade: undefined,
        avgRouteGrade: undefined,
        maxBoulderGrade: undefined,
        maxRouteGrade: undefined,
        year: 2_024,
      },
      {
        Boulder: 1,
        Route: 0,
        avgBoulderGrade: fromGradeToNumber('7b+'),
        avgRouteGrade: undefined,
        maxBoulderGrade: fromGradeToNumber('7b+'),
        maxRouteGrade: undefined,
        year: 2_025,
      },
    ])
  })
})
