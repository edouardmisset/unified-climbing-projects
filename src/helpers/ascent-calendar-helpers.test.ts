import { assert, describe, it } from 'poku'
import type { Ascent } from '~/schema/ascent'
import { fromAscentsToCalendarEntries } from './ascent-calendar-helpers'

describe('fromAscentsToCalendarEntries', () => {
  it('should return an empty array when ascentsArray is undefined', () => {
    const year = 2024
    const result = fromAscentsToCalendarEntries(year, undefined)
    assert.deepEqual(result, [])
  })

  it('should return calendar entries with empty shortText and default tooltip when ascents are undefined', () => {
    const year = 2024
    const ascentsArray: Ascent[][] = [[], [], []]
    const result = fromAscentsToCalendarEntries(year, ascentsArray)
    assert.equal(result.length, 3)
    result.forEach(({ shortText, tooltip }, index) => {
      assert.equal(shortText, '')
      assert.equal(
        tooltip,
        new Date(year, 0, index + 1, 12).toLocaleDateString('en-US', {
          dateStyle: 'short',
        }),
      )
    })
  })

  it('should return calendar entries with correct data when ascents are provided', () => {
    const year = 2024
    const ascentsArray: Ascent[][] = [
      [
        {
          area: 'Wig Wam',
          climber: 'Edouard Misset',
          climbingDiscipline: 'Route',
          comments: 'À la fois superbe grimpe et passage terrifiant. ',
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
        },
      ],
      [
        {
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
        },
      ],
    ]
    const result = fromAscentsToCalendarEntries(year, ascentsArray)
    assert.equal(result.length, 2)

    assert.equal(result[0]?.shortText, '7a')
    assert.equal(result[1]?.shortText, '7b')
  })
})
