import { describe, expect, it } from 'vitest'
import type { Ascent } from '~/schema/ascent'
import { sortByGrade } from './sorter'

const easierAscent: Ascent = {
  area: 'Wig Wam',
  climber: 'Edouard Misset',
  climbingDiscipline: 'Route',
  comments: 'À la fois superbe grimpe et passage terrifiant.',
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
}

const harderAscent: Ascent = {
  area: 'Envers du canyon',
  climber: 'Edouard Misset',
  climbingDiscipline: 'Route',
  comments: 'Dur :(',
  crag: 'Rue des masques',
  date: '2023-08-01T12:00:00.000Z',
  height: 25,
  holds: 'Pocket',
  _id: '2',
  personalGrade: '7b+',
  profile: 'Overhang',
  rating: 3,
  region: 'Hautes-Alpes',
  routeName: 'Flash dans ta gueule',
  style: 'Redpoint',
  topoGrade: '7b',
  tries: 2,
}

describe('sortByGrade', () => {
  it('should return a negative value when the first ascent has a higher grade than the second in descending order', () => {
    const result = sortByGrade(harderAscent, easierAscent)
    expect(result < 0).toBe(true)
  })

  it('should return a positive value when the first ascent has a lower grade than the second in descending order', () => {
    const result = sortByGrade(easierAscent, harderAscent)
    expect(result > 0).toBe(true)
  })

  it('should sort an array of ascents in descending order by grade (default behavior)', () => {
    const ascents: Ascent[] = [easierAscent, harderAscent]
    const sorted = ascents.sort(sortByGrade)
    expect(sorted[0]?.topoGrade).toBe('7b')
    expect(sorted[1]?.topoGrade).toBe('7a')
  })

  it('should sort an array of ascents in ascending order when the descending flag is false', () => {
    const ascents: Ascent[] = [easierAscent, harderAscent]
    const sorted = ascents.sort((a, b) => sortByGrade(a, b, { descending: false }))
    expect(sorted[0]?.topoGrade).toBe('7a')
    expect(sorted[1]?.topoGrade).toBe('7b')
  })
})
