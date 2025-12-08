import { describe, expect, it } from 'vitest'
import { sampleAscents } from '~/backup/sample-ascents'
import { ASCENT_STYLE_TO_COLOR } from '~/constants/ascents'
import { getAscentsByStyle } from './get-ascents-by-style'

describe('getAscentsByStyle', () => {
  const testAscents = sampleAscents
  it('should return empty array for empty input', () => {
    const result = getAscentsByStyle([])
    expect(result).toEqual([])
  })

  it('should return correct object for a single style', () => {
    const flashAscents = testAscents.filter(({ style }) => style === 'Flash')
    const result = getAscentsByStyle(flashAscents)
    expect(result).toEqual([
      {
        color: ASCENT_STYLE_TO_COLOR.Flash,
        id: 'Flash',
        label: 'Flash',
        value: 21,
      },
    ])
    // Ensure no other entry is returned
    expect(result.length).toEqual(1)
  })

  it('should return correct objects for multiple styles', () => {
    const result = getAscentsByStyle(testAscents)
    const expected = [
      {
        color: ASCENT_STYLE_TO_COLOR.Onsight,
        id: 'Onsight',
        label: 'Onsight',
        value: 41,
      },
      {
        color: ASCENT_STYLE_TO_COLOR.Flash,
        id: 'Flash',
        label: 'Flash',
        value: 21,
      },
      {
        color: ASCENT_STYLE_TO_COLOR.Redpoint,
        id: 'Redpoint',
        label: 'Redpoint',
        value: 38,
      },
    ]
    expect(result).toEqual(expected)
  })
})
