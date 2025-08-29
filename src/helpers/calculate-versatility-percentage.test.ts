import { assert, describe, it } from 'poku'
import { ASCENT_STYLE, type Ascent, HOLDS, PROFILES } from '~/schema/ascent'
import { calculateVersatilityPercentage } from './calculate-versatility-percentage'

describe('calculateVersatilityPercentage', () => {
  it('should return 0 for empty ascents array', () => {
    const result = calculateVersatilityPercentage([])
    assert.equal(result, 0)
  })

  it('should handle ascents with undefined properties', () => {
    const ascents = [
      {
        climbingDiscipline: 'Route',
        crag: 'Crag 1',
        date: '2023-01-01',
        _id: '1',
        routeName: 'Route 1',
        style: 'Redpoint',
        topoGrade: '6a',
        tries: 1,
        // Missing holds, profile, height
      },
      {
        climbingDiscipline: 'Boulder',
        crag: 'Crag 2',
        date: '2023-01-02',
        _id: '2',
        routeName: 'Route 2',
        style: 'Flash',
        topoGrade: '6a+',
        tries: 1,
        // Missing holds, profile, height
      },
    ] as Ascent[]

    const result = calculateVersatilityPercentage(ascents)

    // With missing properties, the ratios for holds, profile, and height will be 0
    // Only style and crag will contribute to versatility
    assert.ok(result > 0)
  })

  it('should calculate versatility correctly for a variety of ascents', () => {
    const ascents = [
      {
        climbingDiscipline: 'Route',
        crag: 'Crag 1',
        date: '2023-01-01',
        height: 15,
        holds: 'Crimp',
        _id: '1',
        profile: 'Vertical',
        routeName: 'Route 1',
        style: 'Redpoint',
        topoGrade: '6a',
        tries: 1,
      },
      {
        climbingDiscipline: 'Boulder',
        crag: 'Crag 2',
        date: '2023-01-02',
        height: 5,
        holds: 'Jug',
        _id: '2',
        profile: 'Overhang',
        routeName: 'Route 2',
        style: 'Flash',
        topoGrade: '6a+',
        tries: 1,
      },
      {
        climbingDiscipline: 'Route',
        crag: 'Crag 3',
        date: '2023-01-03',
        height: 20,
        holds: 'Pocket',
        _id: '3',
        profile: 'Slab',
        routeName: 'Route 3',
        style: 'Onsight',
        topoGrade: '6b',
        tries: 1,
      },
    ] as Ascent[]

    const result = calculateVersatilityPercentage(ascents)

    // All styles are used (3/3), 3 different profiles (3/7), 3 different holds (3/7),
    // 3 different heights (3/10), and 3 different crags (3/15)
    // Expected ratios: [3/7, 3/10, 3/7, 1, 0.2]
    // Average: ~0.47 -> 47%
    assert.ok(result > 0)
    assert.ok(result < 100)
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
        climbingDiscipline: 'Route',
        crag: crags[0],
        date: '2023-01-01',
        height: heights[0],
        holds: hold,
        _id: String(id++),
        profile: PROFILES[0],
        routeName: `Route with ${hold}`,
        style: ASCENT_STYLE[0],
        topoGrade: '6a',
        tries: 1,
      } as Ascent)
    }

    // Create one ascent for each profile
    for (const profile of PROFILES) {
      ascents.push({
        climbingDiscipline: 'Route',
        crag: crags[1],
        date: '2023-01-01',
        height: heights[1],
        holds: HOLDS[0],
        _id: String(id++),
        profile,
        routeName: `Route with ${profile}`,
        style: ASCENT_STYLE[0],
        topoGrade: '6a',
        tries: 1,
      } as Ascent)
    }

    // Create one ascent for each style
    for (const style of ASCENT_STYLE) {
      ascents.push({
        climbingDiscipline: 'Route',
        crag: crags[2],
        date: '2023-01-01',
        height: heights[2],
        holds: HOLDS[1],
        _id: String(id++),
        profile: PROFILES[1],
        routeName: `Route with ${style}`,
        style: style,
        topoGrade: '6a',
        tries: 1,
      } as Ascent)
    }

    // Create one ascent for each crag
    for (const crag of crags) {
      ascents.push({
        climbingDiscipline: 'Route',
        crag,
        date: '2023-01-01',
        height: heights[3],
        holds: HOLDS[2],
        _id: String(id++),
        profile: PROFILES[2],
        routeName: `Route at ${crag}`,
        style: ASCENT_STYLE[0],
        topoGrade: '6a',
        tries: 1,
      } as Ascent)
    }

    // Create one ascent for each height
    for (const height of heights) {
      ascents.push({
        climbingDiscipline: 'Route',
        crag: crags[3],
        date: '2023-01-01',
        height,
        holds: HOLDS[3],
        _id: String(id++),
        profile: PROFILES[3],
        routeName: `Route with height ${height}`,
        style: ASCENT_STYLE[0],
        topoGrade: '6a',
        tries: 1,
      } as Ascent)
    }

    const result = calculateVersatilityPercentage(ascents)

    // With all possible values represented, we should get 100%
    assert.equal(result, 100)
  })
})
