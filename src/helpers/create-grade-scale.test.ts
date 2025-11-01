import { describe, expect, it } from 'vitest'
import type { Ascent, Grade } from '~/schema/ascent'
import { createGradeScaleFromAscents } from './create-grade-scale'

describe('createGradeScaleFromAscents', () => {
  it('should return all grades when given an empty array', () => {
    const ascents: Ascent[] = []
    const result = createGradeScaleFromAscents(ascents)
    // Since it returns [..._GRADES], we expect all grades
    expect(result.length).toBeGreaterThan(0)
    expect(result).toContain('1a')
    expect(result).toContain('9c')
  })

  it('should return a grade scale between the min and max grades from ascents', () => {
    const ascents: Ascent[] = [
      { grade: '6c' } as Ascent,
      { grade: '6a' } as Ascent,
      { grade: '7a' } as Ascent,
      { grade: '6b+' } as Ascent,
    ]
    const expectedScale: Grade[] = ['6a', '6a+', '6b', '6b+', '6c', '6c+', '7a']
    const result = createGradeScaleFromAscents(ascents)
    expect(result).toEqual(expectedScale)
  })

  it('should handle single ascent', () => {
    const ascents: Ascent[] = [{ grade: '7a' } as Ascent]
    const expectedScale: Grade[] = ['7a']
    const result = createGradeScaleFromAscents(ascents)
    expect(result).toEqual(expectedScale)
  })

  it('should handle ascents with same grade', () => {
    const ascents: Ascent[] = [
      { grade: '6b' } as Ascent,
      { grade: '6b' } as Ascent,
      { grade: '6b' } as Ascent,
    ]
    const expectedScale: Grade[] = ['6b']
    const result = createGradeScaleFromAscents(ascents)
    expect(result).toEqual(expectedScale)
  })
})
