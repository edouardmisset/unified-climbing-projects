import { describe, expect, it } from 'vitest'
import {
  formatNumber,
  formatRatioAsPercent,
  formatUnit,
  formatWholePercent,
} from './number-formatter'

const OPTIONAL_THIN_SPACE = String.raw`[\s\u00A0\u202F]?`

describe('number formatter', () => {
  it('formats plain numbers using US conventions', () => {
    expect(formatNumber(1_234.5)).toMatch(new RegExp(`1${OPTIONAL_THIN_SPACE}234,5`, 'u'))
  })

  it('formats whole percentages using US conventions', () => {
    expect(formatWholePercent(42)).toMatch(new RegExp(`42${OPTIONAL_THIN_SPACE}%`, 'u'))
  })

  it('formats ratio percentages using US conventions', () => {
    expect(formatRatioAsPercent(0.42)).toMatch(new RegExp(`42${OPTIONAL_THIN_SPACE}%`, 'u'))
  })

  it('formats metric units using US conventions', () => {
    expect(formatUnit(12, 'meter', { unitDisplay: 'short' })).toMatch(
      new RegExp(`12${OPTIONAL_THIN_SPACE}m`, 'u'),
    )
  })
})
