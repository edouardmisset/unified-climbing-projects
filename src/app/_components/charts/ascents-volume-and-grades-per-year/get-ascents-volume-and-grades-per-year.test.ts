import { describe, expect, it } from 'vitest'
import { sampleAscents } from '~/backup/sample-ascents'
import { fromGradeToNumber } from '~/helpers/grade-converter'
import { ascentIdSchema, gradeSchema, climbingDisciplineSchema, type Ascent } from '~/schema/ascent'
import { isoDateSchema } from '~/schema/generic'
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
        _id: ascentIdSchema.parse('volume-and-grade-1'),
        climbingDiscipline: climbingDisciplineSchema.parse('Route'),
        date: isoDateSchema.parse('2023-01-10'),
        topoGrade: gradeSchema.parse('6a'),
      },
      {
        ...secondAscent,
        _id: ascentIdSchema.parse('volume-and-grade-2'),
        climbingDiscipline: climbingDisciplineSchema.parse('Route'),
        date: isoDateSchema.parse('2023-05-08'),
        topoGrade: gradeSchema.parse('6b'),
      },
      {
        ...thirdAscent,
        _id: ascentIdSchema.parse('volume-and-grade-3'),
        climbingDiscipline: climbingDisciplineSchema.parse('Boulder'),
        date: isoDateSchema.parse('2023-08-02'),
        topoGrade: gradeSchema.parse('7a'),
      },
      {
        ...fourthAscent,
        _id: ascentIdSchema.parse('volume-and-grade-4'),
        climbingDiscipline: climbingDisciplineSchema.parse('Boulder'),
        date: isoDateSchema.parse('2025-03-17'),
        topoGrade: gradeSchema.parse('7b+'),
      },
      {
        ...fifthAscent,
        _id: ascentIdSchema.parse('volume-and-grade-5'),
        climbingDiscipline: climbingDisciplineSchema.parse('Multi-Pitch'),
        date: isoDateSchema.parse('2025-09-13'),
        topoGrade: gradeSchema.parse('8a'),
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
