import { describe, expect, it } from 'vitest'
import type { Ascent } from '~/schema/ascent'
import { writeAscentsDisciplineText } from './write-ascents-discipline-text'

const route = { discipline: 'Sport' } as const
const boulder = { discipline: 'Bouldering' } as const

describe('writeAscentsDisciplineText', () => {
  it('should return "ascents" when no ascents are provided', () => {
    const ascents = [] satisfies Partial<Ascent>[]
    const result = writeAscentsDisciplineText(ascents)
    expect(result).toBe('ascents')
  })

  it('should return the discipline in lowercase without trailing "s" for a single ascent', () => {
    const ascents = [route] satisfies Partial<Ascent>[]
    const result = writeAscentsDisciplineText(ascents)
    expect(result).toBe('route')
  })

  it('should return the discipline in lowercase with trailing "s" for multiple ascents sharing the same discipline', () => {
    const ascents = [boulder, boulder] satisfies Partial<Ascent>[]
    const result = writeAscentsDisciplineText(ascents)
    expect(result).toBe('boulders')
  })

  it('should return "ascent" with or without trailing "s" for mixed disciplines', () => {
    const ascentsMultiple = [route, boulder] satisfies Partial<Ascent>[]
    const resultMultiple = writeAscentsDisciplineText(ascentsMultiple)
    expect(resultMultiple).toBe('ascents')
  })
})
