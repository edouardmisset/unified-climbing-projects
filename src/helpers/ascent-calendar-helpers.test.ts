import { describe, expect, it } from 'vitest'
import type { Ascent } from '~/schema/ascent'
import { fromAscentsToCalendarEntries } from './ascent-calendar-helpers'

describe('fromAscentsToCalendarEntries', () => {
  it('should return an empty array when ascentsArray is undefined', () => {
    const year = 2024
    const result = fromAscentsToCalendarEntries(year, undefined)
    expect(result).toEqual([])
  })

  it('should return calendar entries with empty shortText when ascents are undefined', () => {
    const year = 2024
    const ascentsArray: Ascent[][] = [[], [], []]
    const result = fromAscentsToCalendarEntries(year, ascentsArray)
    expect(result.length).toBe(3)
    for (const { shortText } of result) {
      expect(shortText).toBe('')
    }
  })

  it('should return calendar entries with correct data when ascents are provided', () => {
    const year = 2024
    const ascentsArray: Ascent[][] = [
      [
        {
          area: 'Wig Wam',
          discipline: 'Sport',
          comments: 'À la fois superbe grimpe et passage terrifiant. ',
          crag: 'Ewige Jagdgründe',
          date: '2024-10-27T12:00:00.000Z',
          height: 25,
          holds: 'Crimp',
          _id: '1',
          personalGrade: '6c+',
          profile: 'Arête',
          rating: 4,
          name: 'Black Knight',
          style: 'Onsight',
          grade: '7a',
          tries: 1,
        },
      ],
      [
        {
          area: 'Envers du canyon',
          discipline: 'Sport',
          comments: 'Dur :(',
          crag: 'Rue des masques',
          date: '2023-08-01T12:00:00.000Z',
          height: 25,
          holds: 'Pocket',
          _id: '2',
          personalGrade: '7b+',
          profile: 'Overhang',
          rating: 3,
          name: 'Flash dans ta gueule',
          style: 'Redpoint',
          grade: '7b',
          tries: 2,
        },
      ],
    ]
    const result = fromAscentsToCalendarEntries(year, ascentsArray)
    expect(result.length).toBe(2)

    expect(result[0]?.shortText).toBe('7a')
    expect(result[1]?.shortText).toBe('7b')
  })
})
