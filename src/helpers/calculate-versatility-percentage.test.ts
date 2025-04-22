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
        id: 1,
        routeName: 'Route 1',
        crag: 'Crag 1',
        date: '2023-01-01',
        style: 'Redpoint',
        tries: 1,
        topoGrade: '6a',
        climbingDiscipline: 'Route',
        // Missing holds, profile, height
      },
      {
        id: 2,
        routeName: 'Route 2',
        crag: 'Crag 2',
        date: '2023-01-02',
        style: 'Flash',
        tries: 1,
        topoGrade: '6a+',
        climbingDiscipline: 'Boulder',
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
        id: 1,
        routeName: 'Route 1',
        crag: 'Crag 1',
        date: '2023-01-01',
        style: 'Redpoint',
        tries: 1,
        topoGrade: '6a',
        climbingDiscipline: 'Route',
        holds: 'Crimp',
        profile: 'Vertical',
        height: 15,
      },
      {
        id: 2,
        routeName: 'Route 2',
        crag: 'Crag 2',
        date: '2023-01-02',
        style: 'Flash',
        tries: 1,
        topoGrade: '6a+',
        climbingDiscipline: 'Boulder',
        holds: 'Jug',
        profile: 'Overhang',
        height: 5,
      },
      {
        id: 3,
        routeName: 'Route 3',
        crag: 'Crag 3',
        date: '2023-01-03',
        style: 'Onsight',
        tries: 1,
        topoGrade: '6b',
        climbingDiscipline: 'Route',
        holds: 'Pocket',
        profile: 'Slab',
        height: 20,
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
        id: id++,
        routeName: `Route with ${hold}`,
        crag: crags[0],
        date: '2023-01-01',
        style: ASCENT_STYLE[0],
        tries: 1,
        topoGrade: '6a',
        climbingDiscipline: 'Route',
        holds: hold,
        profile: PROFILES[0],
        height: heights[0],
      } as Ascent)
    }

    // Create one ascent for each profile
    for (const profile of PROFILES) {
      ascents.push({
        id: id++,
        routeName: `Route with ${profile}`,
        crag: crags[1],
        date: '2023-01-01',
        style: ASCENT_STYLE[0],
        tries: 1,
        topoGrade: '6a',
        climbingDiscipline: 'Route',
        holds: HOLDS[0],
        profile,
        height: heights[1],
      } as Ascent)
    }

    // Create one ascent for each style
    for (const style of ASCENT_STYLE) {
      ascents.push({
        id: id++,
        routeName: `Route with ${style}`,
        crag: crags[2],
        date: '2023-01-01',
        style: style,
        tries: 1,
        topoGrade: '6a',
        climbingDiscipline: 'Route',
        holds: HOLDS[1],
        profile: PROFILES[1],
        height: heights[2],
      } as Ascent)
    }

    // Create one ascent for each crag
    for (const crag of crags) {
      ascents.push({
        id: id++,
        routeName: `Route at ${crag}`,
        crag,
        date: '2023-01-01',
        style: ASCENT_STYLE[0],
        tries: 1,
        topoGrade: '6a',
        climbingDiscipline: 'Route',
        holds: HOLDS[2],
        profile: PROFILES[2],
        height: heights[3],
      } as Ascent)
    }

    // Create one ascent for each height
    for (const height of heights) {
      ascents.push({
        id: id++,
        routeName: `Route with height ${height}`,
        crag: crags[3],
        date: '2023-01-01',
        style: ASCENT_STYLE[0],
        tries: 1,
        topoGrade: '6a',
        climbingDiscipline: 'Route',
        holds: HOLDS[3],
        profile: PROFILES[3],
        height,
      } as Ascent)
    }

    const result = calculateVersatilityPercentage(ascents)

    // With all possible values represented, we should get 100%
    assert.equal(result, 100)
  })
})
