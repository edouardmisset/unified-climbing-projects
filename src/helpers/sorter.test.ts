import { assert, describe, it } from 'poku'
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
  personalGrade: '6c+',
  profile: 'Arête',
  rating: 4,
  routeName: 'Black Knight',
  style: 'Onsight',
  topoGrade: '7a',
  tries: 1,
  id: 1,
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
  personalGrade: '7b+',
  profile: 'Overhang',
  rating: 3,
  region: 'Hautes-Alpes',
  routeName: 'Flash dans ta gueule',
  style: 'Redpoint',
  topoGrade: '7b',
  tries: 2,
  id: 2,
}

describe('sortByGrade', () => {
  it('should return a negative value when the first ascent has a higher grade than the second in descending order', () => {
    const result = sortByGrade(harderAscent, easierAscent)
    assert.ok(result < 0)
  })

  it('should return a positive value when the first ascent has a lower grade than the second in descending order', () => {
    const result = sortByGrade(easierAscent, harderAscent)
    assert.ok(result > 0)
  })

  it('should sort an array of ascents in descending order by grade (default behavior)', () => {
    const ascents: Ascent[] = [easierAscent, harderAscent]
    const sorted = ascents.sort(sortByGrade)
    assert.equal(sorted[0]?.topoGrade, '7b')
    assert.equal(sorted[1]?.topoGrade, '7a')
  })

  it('should sort an array of ascents in ascending order when the descending flag is false', () => {
    const ascents: Ascent[] = [easierAscent, harderAscent]
    const sorted = ascents.sort((a, b) => sortByGrade(a, b, { descending: false }))
    assert.equal(sorted[0]?.topoGrade, '7a')
    assert.equal(sorted[1]?.topoGrade, '7b')
  })
})
