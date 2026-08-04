import { describe, expect, it, vi } from 'vite-plus/test'
import type { Ascent } from '~/schema/ascent'
import { getTopTenAscents } from './get-top-ten-ascents'

function ascent(name: string, grade: Ascent['grade'], date = '2026-06-01'): Ascent {
  return {
    _id: name,
    crag: 'Test Crag',
    date,
    discipline: 'Sport',
    grade,
    name,
    style: 'Redpoint',
    tries: 1,
  }
}

describe('getTopTenAscents', () => {
  it('returns an empty result without mutating an empty input', () => {
    expect(getTopTenAscents({ ascents: [], timeframe: 'all-time' })).toStrictEqual([])
  })

  it('sorts by points, keeps the top ten, and leaves the input unchanged', () => {
    const ascents = Array.from({ length: 12 }, (_, index) =>
      ascent(`Route ${index}`, index === 11 ? '8a' : '6a'),
    )
    const original = structuredClone(ascents)

    const result = getTopTenAscents({ ascents, timeframe: 'all-time' })

    expect(result).toHaveLength(10)
    expect(result[0]).toMatchObject({ name: 'Route 11', points: 1_000 })
    expect(ascents).toStrictEqual(original)
  })

  it('filters a selected calendar year', () => {
    expect(
      getTopTenAscents({
        ascents: [ascent('Current', '7a', '2025-01-01'), ascent('Other', '8a', '2024-12-31')],
        timeframe: 'year',
        year: 2_025,
      }).map(({ name }) => name),
    ).toStrictEqual(['Current'])
  })

  it('filters the rolling twelve-month timeframe', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-04T12:00:00Z'))

    expect(
      getTopTenAscents({
        ascents: [ascent('Recent', '7a', '2026-01-01'), ascent('Old', '8a', '2025-01-01')],
        timeframe: 'last-12-months',
      }).map(({ name }) => name),
    ).toStrictEqual(['Recent'])

    vi.useRealTimers()
  })
})
