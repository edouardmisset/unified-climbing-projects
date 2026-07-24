import { describe, expect, it } from 'vitest'
import { calendarDateSchema, emptyStringToUndefined } from './common'

describe('calendarDateSchema', () => {
  it.each(['2024-02-29', '2025-01-01', '0000-01-01'])(
    'accepts the valid calendar date %s',
    (date) => {
      expect(calendarDateSchema.parse(date)).toBe(date)
    },
  )

  it.each(['2023-02-29', '2024-02-30', '2024-13-01', '2024-1-01', '2024-01-01T00:00:00Z'])(
    'rejects the invalid calendar date %s',
    (date) => {
      expect(calendarDateSchema.safeParse(date).success).toBe(false)
    },
  )
})

describe('emptyStringToUndefined', () => {
  it('normalizes empty and whitespace-only strings', () => {
    expect(emptyStringToUndefined('')).toBeUndefined()
    expect(emptyStringToUndefined('   ')).toBeUndefined()
  })

  it('preserves non-empty strings and non-string values', () => {
    expect(emptyStringToUndefined(' value ')).toBe(' value ')
    expect(emptyStringToUndefined(0)).toBe(0)
  })
})
