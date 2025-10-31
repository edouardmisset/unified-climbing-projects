import { describe, expect, it } from 'vitest'
import { NOT_AVAILABLE } from '~/constants/generic'
import type { Ascent } from '~/schema/ascent'
import { getAverageGrade } from './get-average-grade'

const ascent1: Ascent = {
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
}
const ascent2: Ascent = {
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
}
const ascent3: Ascent = {
  area: 'Tarzoon',
  discipline: 'Sport',
  crag: 'Claret',
  date: '2024-01-01T12:00:00.000Z',
  height: 25,
  holds: 'Crimp',
  _id: '3',
  personalGrade: '7b',
  profile: 'Overhang',
  rating: 4,
  name: 'Linéa',
  style: 'Onsight',
  grade: '7b',
  tries: 1,
}

describe('getAverageGrade', () => {
  it('should return NOT_AVAILABLE when no ascents are provided', () => {
    const result = getAverageGrade([])
    expect(result).toBe(NOT_AVAILABLE)
  })

  it('should return the grade of the single ascent when only one is provided', () => {
    const ascents: Ascent[] = [ascent1]
    // Expecting that the conversion functions return the same grade for a sole ascent.
    const result = getAverageGrade(ascents)
    expect(result).toBe('7a')
  })

  it('should return the correct average grade when multiple ascents are provided', () => {
    const ascents: Ascent[] = [ascent1, ascent2]
    const result = getAverageGrade(ascents)
    expect(result).toBe('7a+')
  })

  it('should return the same grade if all ascents have identical grades', () => {
    const ascents: Ascent[] = [ascent2, ascent3]
    const result = getAverageGrade(ascents)
    expect(result).toBe('7b')
  })
})
