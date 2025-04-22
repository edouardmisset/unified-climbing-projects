import { assert, describe, it } from 'poku'
import {
  COEFFICIENT_TOP_TEN,
  COEFFICIENT_VOLUME,
  DEFAULT_GRADE,
} from '~/constants/ascents'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { calculateEfficiencyPercentage } from './calculate-efficiency-percentage'
import {
  calculateProgressionPercentage,
  createHardestGradeMap,
} from './calculate-progression-percentage'
import { calculateScore } from './calculate-score'
import { calculateTopTenScore } from './calculate-top-ten'
import { calculateVersatilityPercentage } from './calculate-versatility-percentage'
import { fromGradeToNumber } from './grade-converter'

describe('calculateScore', () => {
  it('should return 0 when year is invalid', () => {
    const result = calculateScore({
      ascents: [{ id: 1 } as Ascent],
      trainingSessions: [{ id: 1 } as TrainingSession],
      year: -1,
    })

    assert.equal(result, 0)
  })

  it('should return 0 when ascents array is empty', () => {
    const result = calculateScore({
      ascents: [],
      trainingSessions: [{ id: 1 } as TrainingSession],
      year: 2023,
    })

    assert.equal(result, 0)
  })

  it('should calculate score correctly for a simple case', () => {
    // Create test data with a simple scenario
    const year = 2023
    const previousYear = year - 1

    const currentYearAscent: Ascent = {
      id: 1,
      date: `${year}-01-01T10:00:00Z`,
      climbingDiscipline: 'Boulder',
      style: 'Flash',
      crag: 'Test Crag',
      topoGrade: '7a',
      routeName: 'Test Route 1',
      tries: 1,
    }

    const previousYearAscent: Ascent = {
      id: 2,
      date: `${previousYear}-01-01T10:00:00Z`,
      climbingDiscipline: 'Boulder',
      style: 'Redpoint',
      crag: 'Test Crag',
      topoGrade: '6c',
      routeName: 'Test Route 2',
      tries: 3,
    }

    const ascents: Ascent[] = [currentYearAscent, previousYearAscent]

    const trainingSessions: TrainingSession[] = [
      {
        id: 1,
        date: `${year}-01-01T09:00:00Z`,
        sessionType: 'Out',
      },
    ]

    const result = calculateScore({
      ascents,
      trainingSessions,
      year,
    })

    // Calculate expected result manually
    const currentYearAscents = [currentYearAscent]
    const previousYearAscents = [previousYearAscent]
    const outdoorTrainingSessions = trainingSessions

    const efficiencyPercentage = calculateEfficiencyPercentage({
      ascents: currentYearAscents,
      trainingSessions: outdoorTrainingSessions,
    })

    const versatilityPercentage =
      calculateVersatilityPercentage(currentYearAscents)

    const progressionPercentage = calculateProgressionPercentage({
      ascents: [...currentYearAscents, ...previousYearAscents],
      year,
    })

    const averageGradeValue = fromGradeToNumber('7a')
    const volumeScore =
      averageGradeValue * currentYearAscents.length * COEFFICIENT_VOLUME

    const hardestGradeValues = [
      ...createHardestGradeMap(currentYearAscents).values(),
    ].map(fromGradeToNumber)

    const hardestGradeValue =
      hardestGradeValues[0] !== undefined
        ? hardestGradeValues[0]
        : fromGradeToNumber(DEFAULT_GRADE)

    const topTenScore =
      calculateTopTenScore(currentYearAscents) *
      hardestGradeValue *
      COEFFICIENT_TOP_TEN

    const expected = Math.round(
      volumeScore *
        topTenScore *
        (1 + efficiencyPercentage / 100) *
        (1 + versatilityPercentage / 100) *
        (1 + progressionPercentage / 100),
    )

    assert.equal(result, expected)
  })

  it('should calculate score consistently with the same inputs', () => {
    const year = 2023
    const previousYear = year - 1

    const ascents: Ascent[] = [
      // Current year ascents
      {
        id: 1,
        date: `${year}-01-01T10:00:00Z`,
        climbingDiscipline: 'Boulder',
        style: 'Flash',
        crag: 'Test Crag',
        topoGrade: '7a',
        routeName: 'Test Route 1',
        tries: 1,
      },
      // Previous year ascent
      {
        id: 2,
        date: `${previousYear}-01-01T10:00:00Z`,
        climbingDiscipline: 'Boulder',
        style: 'Redpoint',
        crag: 'Test Crag',
        topoGrade: '6c',
        routeName: 'Test Route 2',
        tries: 3,
      },
    ]

    const trainingSessions: TrainingSession[] = [
      {
        id: 1,
        date: `${year}-01-01T09:00:00Z`,
        sessionType: 'Out',
      },
    ]

    const firstResult = calculateScore({
      ascents,
      trainingSessions,
      year,
    })

    const secondResult = calculateScore({
      ascents,
      trainingSessions,
      year,
    })

    // Function should be deterministic with the same inputs
    assert.equal(firstResult, secondResult)
  })
})
