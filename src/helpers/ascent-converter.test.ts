import { assert, describe, it } from 'poku'
import { sampleAscents } from '~/backup/sample-ascents'
import { DEFAULT_GRADE } from '~/constants/ascents'
import {
  BOULDERING_BONUS_POINTS,
  GRADE_TO_POINTS,
  STYLE_TO_POINTS,
} from '~/schema/ascent'
import {
  fromAscentToPoints,
  fromGradeToBackgroundColor,
  fromGradeToClassName,
  fromPointToGrade,
} from './ascent-converter'

describe('fromGradeToBackgroundColor', () => {
  it('should return black when grade is undefined', () => {
    const result = fromGradeToBackgroundColor(undefined)
    assert.equal(result, 'black')
  })

  it('should return the correct background color based on grade', () => {
    const result = fromGradeToBackgroundColor('7a+')
    assert.equal(result, 'var(--7a_)')
  })
})

describe('fromGradeToClassName', () => {
  it('should return undefined when grade is undefined', () => {
    const result = fromGradeToClassName(undefined)
    assert.equal(result, undefined)
  })

  it('should return a class name with underscores replacing plus signs', () => {
    const result = fromGradeToClassName('7a+')
    assert.equal(result, '_7a_')
  })
})

describe('fromAscentToPoints', () => {
  it('should return the sum of grade and style points when both keys exist', () => {
    const onsight7a = sampleAscents[0]
    const redpoint7b = sampleAscents[1]
    const flash7aBoulder = sampleAscents[24]

    if (!onsight7a || !redpoint7b || !flash7aBoulder) {
      throw new Error('Ascent not found')
    }

    const result = fromAscentToPoints(onsight7a)
    assert.equal(result, 850)

    const result2 = fromAscentToPoints(redpoint7b)
    assert.equal(result2, 800)

    const result3 = fromAscentToPoints(flash7aBoulder)
    assert.equal(result3, 850)
  })
})

describe('fromPointToGrade', () => {
  it('should convert valid points to the correct grade with default parameters', () => {
    assert.equal(fromPointToGrade(700), '7a')
    assert.equal(fromPointToGrade(800), '7b')
    assert.equal(fromPointToGrade(1000), '8a')
  })

  it('should handle edge cases with minimum and maximum point values', () => {
    const minPoints = Math.min(...Object.values(GRADE_TO_POINTS))
    const minGrade = Object.entries(GRADE_TO_POINTS).find(
      ([_, points]) => points === minPoints,
    )?.[0]
    assert.equal(fromPointToGrade(minPoints), minGrade)

    const maxPoints = Math.max(...Object.values(GRADE_TO_POINTS))
    const maxGrade = Object.entries(GRADE_TO_POINTS).find(
      ([_, points]) => points === maxPoints,
    )?.[0]
    assert.equal(fromPointToGrade(maxPoints), maxGrade)
  })

  it('should adjust points correctly for different climbing disciplines', () => {
    const pointsFor7a = GRADE_TO_POINTS['7a']

    const pointsWith7aBoulderBonus = pointsFor7a + BOULDERING_BONUS_POINTS
    assert.equal(
      fromPointToGrade(pointsWith7aBoulderBonus, {
        climbingDiscipline: 'Boulder',
      }),
      '7a',
    )
  })

  it('should adjust points correctly for different climbing styles', () => {
    const pointsFor7a = GRADE_TO_POINTS['7a']

    const flashPoints = STYLE_TO_POINTS.Flash
    const pointsWith7aFlash = pointsFor7a + flashPoints
    assert.equal(fromPointToGrade(pointsWith7aFlash, { style: 'Flash' }), '7a')

    const onsightPoints = STYLE_TO_POINTS.Onsight
    const pointsWith7aOnsight = pointsFor7a + onsightPoints
    assert.equal(
      fromPointToGrade(pointsWith7aOnsight, { style: 'Onsight' }),
      '7a',
    )
  })

  it('should combine discipline and style adjustments correctly', () => {
    const pointsFor7a = GRADE_TO_POINTS['7a']
    const flashPoints = STYLE_TO_POINTS.Flash

    const combinedPoints = pointsFor7a + flashPoints + BOULDERING_BONUS_POINTS
    assert.equal(
      fromPointToGrade(combinedPoints, {
        climbingDiscipline: 'Boulder',
        style: 'Flash',
      }),
      '7a',
    )
  })

  it('should return DEFAULT_GRADE when points do not match any grade', () => {
    const invalidPoints = 123
    assert.equal(fromPointToGrade(invalidPoints), DEFAULT_GRADE)

    assert.equal(fromPointToGrade(-100), DEFAULT_GRADE)

    const veryLargePoints = 10_000
    assert.equal(fromPointToGrade(veryLargePoints), DEFAULT_GRADE)
  })

  it('should handle conversion from real ascent examples', () => {
    const testAscents = [sampleAscents[0], sampleAscents[1], sampleAscents[24]]

    for (const ascent of testAscents) {
      if (ascent) {
        const points = fromAscentToPoints(ascent)
        const convertedGrade = fromPointToGrade(points, {
          climbingDiscipline: ascent.climbingDiscipline,
          style: ascent.style,
        })
        assert.equal(convertedGrade, ascent.topoGrade)
      }
    }
  })
})
