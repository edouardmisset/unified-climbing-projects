import { describe, expect, it } from 'vite-plus/test'
import { sampleAscents } from '~/backup/sample-ascents'
import { fromGradeToNumber } from '~/helpers/grade-converter'
import type { Ascent } from '~/schema/ascent'
import { getAscentsVolumeAndGradesPerYear } from './get-ascents-volume-and-grades-per-year'

describe('getAscentsVolumeAndGradesPerYear', () => {
  it('should return empty array for empty input', () => {
    const result = getAscentsVolumeAndGradesPerYear([])
    expect(result).toStrictEqual([])
  })

  it('should return yearly discipline counts with max and average grades', () => {
    const [firstAscent, secondAscent, thirdAscent, fourthAscent, fifthAscent] = sampleAscents

    if (!firstAscent || !secondAscent || !thirdAscent || !fourthAscent || !fifthAscent)
      throw new Error('Expected at least five sample ascents')

    const ascents: Ascent[] = [
      {
        ...firstAscent,
        _id: 'volume-and-grade-1',
        discipline: 'Sport',
        date: '2023-01-10',
        grade: '6a',
      },
      {
        ...secondAscent,
        _id: 'volume-and-grade-2',
        discipline: 'Sport',
        date: '2023-05-08',
        grade: '6b',
      },
      {
        ...thirdAscent,
        _id: 'volume-and-grade-3',
        discipline: 'Bouldering',
        date: '2023-08-02',
        grade: '7a',
      },
      {
        ...fourthAscent,
        _id: 'volume-and-grade-4',
        discipline: 'Bouldering',
        date: '2025-03-17',
        grade: '7b+',
      },
      {
        ...fifthAscent,
        _id: 'volume-and-grade-5',
        discipline: 'Multi-Pitch',
        date: '2025-09-13',
        grade: '8a',
      },
    ]

    const result = getAscentsVolumeAndGradesPerYear(ascents)

    expect(result).toStrictEqual([
      {
        Bouldering: 1,
        Sport: 2,
        avgBoulderGrade: fromGradeToNumber('7a'),
        avgRouteGrade: fromGradeToNumber('6a+'),
        maxBoulderGrade: fromGradeToNumber('7a'),
        maxRouteGrade: fromGradeToNumber('6b'),
        year: 2_023,
      },
      {
        Bouldering: 0,
        Sport: 0,
        avgBoulderGrade: undefined,
        avgRouteGrade: undefined,
        maxBoulderGrade: undefined,
        maxRouteGrade: undefined,
        year: 2_024,
      },
      {
        Bouldering: 1,
        Sport: 0,
        avgBoulderGrade: fromGradeToNumber('7b+'),
        avgRouteGrade: undefined,
        maxBoulderGrade: fromGradeToNumber('7b+'),
        maxRouteGrade: undefined,
        year: 2_025,
      },
    ])
  })
})
