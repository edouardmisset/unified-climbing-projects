import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import { getEffectiveFilterValue } from '~/helpers/get-effective-filter-value'
import { PERIOD, RECENT_PERIOD, SPECIAL_PERIOD } from '~/schema/generic'
import type { FilterConfig } from './types'

type DateFilterInput = {
  years: readonly string[]
  selectedYear: string
  selectedPeriod: string
  setYear: (value: string) => void
  setPeriod: (value: string) => void
}

/**
 * Builds the single "Date" filter: years and periods are alternative answers to
 * the same date question, so they share one select and one selection.
 */
export function createDateFilter(input: DateFilterInput): FilterConfig {
  const { years, selectedYear, selectedPeriod, setYear, setPeriod } = input

  const groups = [
    { label: 'Recent', options: RECENT_PERIOD },
    { label: 'Years', options: years },
    { label: 'Special periods', options: SPECIAL_PERIOD },
  ].filter(({ options }) => options.length > 0)

  return {
    name: 'Date',
    options: groups,
    selectedValue: getEffectiveFilterValue(
      groups.flatMap(({ options }) => options),
      selectedPeriod === ALL_VALUE ? selectedYear : selectedPeriod,
    ),
    setValue: value => {
      const isPeriod = (PERIOD as readonly string[]).includes(value)
      setPeriod(isPeriod ? value : ALL_VALUE)
      setYear(isPeriod || value === ALL_VALUE ? ALL_VALUE : value)
    },
    title: 'Date',
  }
}
