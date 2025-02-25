import { assert, describe, it } from 'poku'
import sampleAscents from '~/backup/ascent-data-sample-2024-10-30.json'
import { ASCENT_STYLE_TO_COLOR } from '~/constants/ascents'
import { ascentSchema } from '~/schema/ascent'
import { getAscentsByStyle } from './get-ascents-by-style'

describe('getAscentsByStyle', () => {
  const testAscents = ascentSchema.array().parse(sampleAscents)
  it('should return empty array for empty input', () => {
    const result = getAscentsByStyle([])
    assert.deepEqual(result, [])
  })

  it('should return correct object for a single style', () => {
    const flashAscents = testAscents.filter(({ style }) => style === 'Flash')
    const result = getAscentsByStyle(flashAscents)
    assert.deepEqual(result, [
      {
        id: 'Flash',
        label: 'Flash',
        value: 21,
        color: ASCENT_STYLE_TO_COLOR.Flash,
      },
    ])
    // Ensure no other entry is returned
    assert.deepEqual(result.length, 1)
  })

  it('should return correct objects for multiple styles', () => {
    const result = getAscentsByStyle(testAscents)
    const expected = [
      {
        id: 'Onsight',
        label: 'Onsight',
        value: 41,
        color: ASCENT_STYLE_TO_COLOR.Onsight,
      },
      {
        id: 'Flash',
        label: 'Flash',
        value: 21,
        color: ASCENT_STYLE_TO_COLOR.Flash,
      },
      {
        id: 'Redpoint',
        label: 'Redpoint',
        value: 38,
        color: ASCENT_STYLE_TO_COLOR.Redpoint,
      },
    ]
    assert.deepEqual(result, expected)
  })
})
