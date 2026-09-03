import { describe, expect, it, vi } from 'vite-plus/test'
import { createDateFilter } from './date-filter'

function buildDateFilter({
  selectedPeriod = 'all',
  selectedYear = 'all',
  years = ['2026', '2025'],
}: {
  selectedPeriod?: string
  selectedYear?: string
  years?: readonly string[]
} = {}) {
  const setPeriod = vi.fn<(value: string) => void>()
  const setYear = vi.fn<(value: string) => void>()

  return {
    filter: createDateFilter({
      selectedPeriod,
      selectedYear,
      setPeriod,
      setYear,
      years,
    }),
    setPeriod,
    setYear,
  }
}

describe('createDateFilter', () => {
  it('sets Date as the shared filter name and title', () => {
    const { filter } = buildDateFilter()

    expect(filter.name).toBe('Date')
    expect(filter.title).toBe('Date')
  })

  it('always offers every recent period, then years, then every special period', () => {
    const { filter } = buildDateFilter()

    expect(filter.options).toStrictEqual([
      { label: 'Recent', options: ['Last month', 'Last year'] },
      { label: 'Years', options: ['2026', '2025'] },
      { label: 'Special periods', options: ['Unemployment', 'Road-Trip'] },
    ])
  })

  it('keeps both period groups when the dataset yields no year', () => {
    const { filter } = buildDateFilter({ years: [] })

    expect(filter.options).toStrictEqual([
      { label: 'Recent', options: ['Last month', 'Last year'] },
      { label: 'Special periods', options: ['Unemployment', 'Road-Trip'] },
    ])
  })

  it('clears the year when a period is selected', () => {
    const { filter, setPeriod, setYear } = buildDateFilter({ selectedYear: '2026' })

    filter.setValue('Road-Trip')

    expect(setPeriod).toHaveBeenCalledWith('Road-Trip')
    expect(setYear).toHaveBeenCalledWith('all')
  })

  it('clears the period when a year is selected', () => {
    const { filter, setPeriod, setYear } = buildDateFilter({ selectedPeriod: 'Road-Trip' })

    filter.setValue('2025')

    expect(setYear).toHaveBeenCalledWith('2025')
    expect(setPeriod).toHaveBeenCalledWith('all')
  })

  it('clears both keys when All is selected', () => {
    const { filter, setPeriod, setYear } = buildDateFilter({ selectedPeriod: 'Road-Trip' })

    filter.setValue('all')

    expect(setYear).toHaveBeenCalledWith('all')
    expect(setPeriod).toHaveBeenCalledWith('all')
  })

  it('shows the period when a legacy URL still carries a year', () => {
    const { filter } = buildDateFilter({ selectedPeriod: 'Road-Trip', selectedYear: '2026' })

    expect(filter.selectedValue).toBe('Road-Trip')
  })

  it('keeps every year selectable while a period is active', () => {
    const { filter } = buildDateFilter({ selectedPeriod: 'Road-Trip' })

    expect(filter.options).toContainEqual({ label: 'Years', options: ['2026', '2025'] })
  })
})
