import { describe, expect, it } from 'vitest'
import { sampleAscents } from '~/backup/sample-ascents'
import { type Ascent, GRADE_TO_NUMBER } from '~/schema/ascent'
import { fromGradeToNumber, fromNumberToGrade } from './grade-converter'
import { minMaxGrades } from './min-max-grades'

describe('minMaxGrades', () => {
  it('should return default min and max values when the ascents array is empty', () => {
    const gradeValues = Object.values(GRADE_TO_NUMBER)
    const expectedMin = fromNumberToGrade(Math.min(...gradeValues))
    const expectedMax = fromNumberToGrade(Math.max(...gradeValues))
    const [min, max] = minMaxGrades([])
    expect(min).toBe(expectedMin)
    expect(max).toBe(expectedMax)
  })

  it('should return the same grade for both min and max with a single ascent', () => {
    const ascents: Ascent[] = [
      {
        area: 'Wig Wam',
        climber: 'Edouard Misset',
        climbingDiscipline: 'Route',
        comments: 'À la fois superbe grimpe et passage terrifiant. ',
        crag: 'Ewige Jagdgründe',
        date: '2024-10-27T12:00:00.000Z',
        height: 25,
        holds: 'Crimp',
        _id: '1',
        personalGrade: '6c+',
        profile: 'Arête',
        rating: 4,
        routeName: 'Black Knight',
        style: 'Onsight',
        topoGrade: '7a',
        tries: 1,
      },
    ]
    const [min, max] = minMaxGrades(ascents)
    expect(min).toBe(ascents[0]?.topoGrade)
    expect(max).toBe(ascents[0]?.topoGrade)
  })

  it('should correctly calculate min and max grades for multiple ascents', () => {
    const numericGrades = sampleAscents.map(({ topoGrade }) => fromGradeToNumber(topoGrade))
    const expectedMin = fromNumberToGrade(Math.min(...numericGrades))
    const expectedMax = fromNumberToGrade(Math.max(...numericGrades))
    const [min, max] = minMaxGrades(sampleAscents)
    expect(min).toBe(expectedMin)
    expect(max).toBe(expectedMax)
  })
})
