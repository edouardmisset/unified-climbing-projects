import { describe, expect, it } from 'vite-plus/test'
import { includesAscents, includesTraining } from './climbing-log'

describe('climbing log scope', () => {
  it('identifies the entries included by each scope', () => {
    expect(includesAscents('ascents')).toBe(true)
    expect(includesTraining('ascents')).toBe(false)
    expect(includesAscents('training')).toBe(false)
    expect(includesTraining('training')).toBe(true)
    expect(includesAscents('both')).toBe(true)
    expect(includesTraining('both')).toBe(true)
  })
})
