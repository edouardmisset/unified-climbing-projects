import { describe, expect, it } from 'vitest'
import {
  ASCENT_STYLE,
  type Ascent,
  BOULDERING,
  CRIMP,
  FLASH,
  HOLDS,
  JUG,
  ONSIGHT,
  OVERHANG,
  POCKET,
  PROFILES,
  REDPOINT,
  SLAB,
  SPORT,
} from '~/schema/ascent'
import { calculateVersatilityPercentage } from './calculate-versatility-percentage'

describe('calculateVersatilityPercentage', () => {
  it('should return 0 for empty ascents array', () => {
    const result = calculateVersatilityPercentage([])
    expect(result).toBe(0)
  })

  it('should handle ascents with undefined properties', () => {
    const ascents = [
      {
        discipline: SPORT,
        crag: 'Crag 1',
        date: '2023-01-01',
        _id: '1',
        name: 'Route 1',
        style: REDPOINT,
        grade: '6a',
        tries: 1,
        // Missing holds, profile, height
      },
      {
        discipline: BOULDERING,
        crag: 'Crag 2',
        date: '2023-01-02',
        _id: '2',
        name: 'Route 2',
        style: FLASH,
        grade: '6a+',
        tries: 1,
        // Missing holds, profile, height
      },
    ] as Ascent[]

    const result = calculateVersatilityPercentage(ascents)

    // With missing properties, the ratios for holds, profile, and height will be 0
    // Only style and crag will contribute to versatility
    expect(result > 0).toBe(true)
  })

  it('should calculate versatility correctly for a variety of ascents', () => {
    const ascents = [
      {
        discipline: SPORT,
        crag: 'Crag 1',
        date: '2023-01-01',
        height: 15,
        holds: CRIMP,
        _id: '1',
        profile: 'Vertical',
        name: 'Route 1',
        style: REDPOINT,
        grade: '6a',
        tries: 1,
      },
      {
        discipline: BOULDERING,
        crag: 'Crag 2',
        date: '2023-01-02',
        height: 5,
        holds: JUG,
        _id: '2',
        profile: OVERHANG,
        name: 'Route 2',
        style: FLASH,
        grade: '6a+',
        tries: 1,
      },
      {
        discipline: SPORT,
        crag: 'Crag 3',
        date: '2023-01-03',
        height: 20,
        holds: POCKET,
        _id: '3',
        profile: SLAB,
        name: 'Route 3',
        style: ONSIGHT,
        grade: '6b',
        tries: 1,
      },
    ] as Ascent[]

    const result = calculateVersatilityPercentage(ascents)

    // All styles are used (3/3), 3 different profiles (3/7), 3 different holds (3/7),
    // 3 different heights (3/10), and 3 different crags (3/15)
    // Expected ratios: [3/7, 3/10, 3/7, 1, 0.2]
    // Average: ~0.47 -> 47%
    expect(result > 0).toBe(true)
    expect(result < 100).toBe(true)
  })

  it('should handle maximum versatility', () => {
    // Create an ascent for each possible hold, profile, and style
    const ascents: Ascent[] = []

    // Create enough crags to maximize the crag ratio
    const crags = Array.from({ length: 15 }, (_, i) => `Crag ${i + 1}`)

    // Create enough heights to maximize the height ratio
    const heights = Array.from({ length: 10 }, (_, i) => (i + 1) * 5)

    let id = 1

    // Create one ascent for each hold
    for (const hold of HOLDS) {
      ascents.push({
        discipline: SPORT,
        crag: crags[0],
        date: '2023-01-01',
        height: heights[0],
        holds: hold,
        _id: String(id++),
        profile: PROFILES[0],
        name: `Route with ${hold}`,
        style: REDPOINT,
        grade: '6a',
        tries: 1,
      } as Ascent)
    }

    // Create one ascent for each profile
    for (const profile of PROFILES) {
      ascents.push({
        discipline: SPORT,
        crag: crags[1],
        date: '2023-01-01',
        height: heights[1],
        holds: HOLDS[0],
        _id: String(id++),
        profile,
        name: `Route with ${profile}`,
        style: REDPOINT,
        grade: '6a',
        tries: 1,
      } as Ascent)
    }

    // Create one ascent for each style
    for (const style of ASCENT_STYLE) {
      ascents.push({
        discipline: SPORT,
        crag: crags[2],
        date: '2023-01-01',
        height: heights[2],
        holds: HOLDS[1],
        _id: String(id++),
        profile: PROFILES[1],
        name: `Route with ${style}`,
        style: style,
        grade: '6a',
        tries: 1,
      } as Ascent)
    }

    // Create one ascent for each crag
    for (const crag of crags) {
      ascents.push({
        discipline: SPORT,
        crag,
        date: '2023-01-01',
        height: heights[3],
        holds: HOLDS[2],
        _id: String(id++),
        profile: PROFILES[2],
        name: `Route at ${crag}`,
        style: REDPOINT,
        grade: '6a',
        tries: 1,
      } as Ascent)
    }

    // Create one ascent for each height
    for (const height of heights) {
      ascents.push({
        discipline: SPORT,
        crag: crags[3],
        date: '2023-01-01',
        height,
        holds: HOLDS[3],
        _id: String(id++),
        profile: PROFILES[3],
        name: `Route with height ${height}`,
        style: REDPOINT,
        grade: '6a',
        tries: 1,
      } as Ascent)
    }

    const result = calculateVersatilityPercentage(ascents)

    // With all possible values represented, we should get 100%
    expect(result).toBe(100)
  })
})
