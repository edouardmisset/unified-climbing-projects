import { assert, describe, it } from 'poku'
import type { Ascent } from '~/schema/ascent'
import { writeAscentsDisciplineText } from './write-ascents-discipline-text'

const route = { climbingDiscipline: 'Route' } as const
const boulder = { climbingDiscipline: 'Boulder' } as const

describe('writeAscentsDisciplineText', () => {
  it('should return "ascents" when no ascents are provided', () => {
    const ascents = [] satisfies Partial<Ascent>[]
    const result = writeAscentsDisciplineText(ascents)
    assert.equal(result, 'ascents')
  })

  it('should return the discipline in lowercase without trailing "s" for a single ascent', () => {
    const ascents = [route] satisfies Partial<Ascent>[]
    const result = writeAscentsDisciplineText(ascents)
    assert.equal(result, 'route')
  })

  it('should return the discipline in lowercase with trailing "s" for multiple ascents sharing the same discipline', () => {
    const ascents = [boulder, boulder] satisfies Partial<Ascent>[]
    const result = writeAscentsDisciplineText(ascents)
    assert.equal(result, 'boulders')
  })

  it('should return "ascent" with or without trailing "s" for mixed disciplines', () => {
    const ascentsMultiple = [route, boulder] satisfies Partial<Ascent>[]
    const resultMultiple = writeAscentsDisciplineText(ascentsMultiple)
    assert.equal(resultMultiple, 'ascents')
  })
})
