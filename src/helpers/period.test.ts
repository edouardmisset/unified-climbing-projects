import 'temporal-polyfill/global'
import 'temporal-polyfill/types/global'
import { describe, expect, it } from 'vite-plus/test'
import { isDateInPeriod, resolveDateSelection } from './period'

const toDate = (plainDate: Temporal.PlainDate): Date => new Date(plainDate.toString())

describe('period helpers', () => {
  describe('isDateInPeriod', () => {
    it('starts the trailing month exactly one calendar month ago', () => {
      const today = Temporal.Now.plainDateISO('UTC')
      const start = toDate(today.subtract({ months: 1 }))
      const dayBeforeStart = toDate(today.subtract({ months: 1, days: 1 }))

      expect(isDateInPeriod(start, 'Last month')).toBe(true)
      expect(isDateInPeriod(dayBeforeStart, 'Last month')).toBe(false)
    })

    it('starts the trailing year exactly one calendar year ago', () => {
      const today = Temporal.Now.plainDateISO('UTC')
      const start = toDate(today.subtract({ years: 1 }))
      const dayBeforeStart = toDate(today.subtract({ years: 1, days: 1 }))

      expect(isDateInPeriod(start, 'Last year')).toBe(true)
      expect(isDateInPeriod(dayBeforeStart, 'Last year')).toBe(false)
    })

    it('ends today, so future dates never match', () => {
      const today = Temporal.Now.plainDateISO('UTC')
      const todayDate = toDate(today)
      const tomorrowDate = toDate(today.add({ days: 1 }))

      expect(isDateInPeriod(todayDate, 'Last month')).toBe(true)
      expect(isDateInPeriod(todayDate, 'Last year')).toBe(true)
      expect(isDateInPeriod(tomorrowDate, 'Last month')).toBe(false)
      expect(isDateInPeriod(tomorrowDate, 'Last year')).toBe(false)
    })

    it('keeps the fixed boundaries of the special periods', () => {
      expect(isDateInPeriod(new Date('2019-06-01'), 'Unemployment')).toBe(true)
      expect(isDateInPeriod(new Date('2019-05-31'), 'Unemployment')).toBe(false)
      expect(isDateInPeriod(new Date('2025-08-20'), 'Road-Trip')).toBe(true)
      expect(isDateInPeriod(new Date('2025-08-21'), 'Road-Trip')).toBe(false)
    })
  })

  describe('resolveDateSelection', () => {
    it('drops a year left over next to an active period', () => {
      expect(resolveDateSelection('2026', 'Road-Trip')).toStrictEqual({
        period: 'Road-Trip',
        year: undefined,
      })
    })

    it('keeps the year when no period is active', () => {
      expect(resolveDateSelection('2026', 'all')).toStrictEqual({ period: undefined, year: 2_026 })
    })

    it('resolves to no date filter when neither is active', () => {
      expect(resolveDateSelection('all', 'all')).toStrictEqual({
        period: undefined,
        year: undefined,
      })
    })
  })
})
