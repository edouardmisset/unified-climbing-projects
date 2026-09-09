import { describe, expect, it } from 'vite-plus/test'
import {
  calendarDateSchema,
  integerCellCodec,
  optionalIntegerCellCodec,
  optionalPercentCellCodec,
  optionalTextCodec,
} from './common'

describe('calendarDateSchema', () => {
  it.each(['2024-02-29', '2025-01-01', '0000-01-01'])(
    'accepts the valid calendar date %s',
    date => {
      expect(calendarDateSchema.parse(date)).toBe(date)
    },
  )

  it.each(['2023-02-29', '2024-02-30', '2024-13-01', '2024-1-01', '2024-01-01T00:00:00Z'])(
    'rejects the invalid calendar date %s',
    date => {
      expect(calendarDateSchema.safeParse(date).success).toBe(false)
    },
  )
})

describe('form codecs', () => {
  const missingValue: { value?: never } = {}

  it('round-trips optional text through its canonical form representation', () => {
    expect(optionalTextCodec.decode('   ')).toBeUndefined()
    expect(optionalTextCodec.encode(missingValue.value)).toBe('')
    expect(optionalTextCodec.decode(' value ')).toBe('value')
    expect(optionalTextCodec.encode(' value ')).toBe('value')
  })

  it('round-trips required and optional integers', () => {
    expect(integerCellCodec.decode('42')).toBe(42)
    expect(integerCellCodec.encode(42)).toBe('42')
    expect(optionalIntegerCellCodec.decode('')).toBeUndefined()
    expect(optionalIntegerCellCodec.encode(missingValue.value)).toBe('')
  })

  it('validates percentages in both directions', () => {
    expect(optionalPercentCellCodec.decode('75')).toBe(75)
    expect(optionalPercentCellCodec.encode(75)).toBe('75')
    expect(optionalPercentCellCodec.safeDecode('101').success).toBe(false)
    expect(optionalPercentCellCodec.safeEncode(101).success).toBe(false)
  })
})
