import { useCallback, useMemo } from 'react'
import { CustomSelect } from '../custom-select/custom-select.tsx'
import { ALL_VALUE } from '../dashboard/constants.ts'
import { StickyFilterBar } from '../sticky-filter-bar/sticky-filter-bar.tsx'
import type { BaseFilterBarProps } from './types.ts'

export function FilterBar({ filters }: BaseFilterBarProps) {
  const resetFilters = useCallback(() => {
    for (const filter of filters) {
      filter.handleChange({
        target: { value: ALL_VALUE },
      } as React.ChangeEvent<HTMLSelectElement>)
    }
  }, [filters])

  const isOneFilterActive = useMemo(
    () => filters.some(filter => filter.selectedValue !== ALL_VALUE),
    [filters],
  )

  return (
    <StickyFilterBar
      clearFilters={resetFilters}
      isOneFilterActive={isOneFilterActive}
    >
      {filters.map(({ handleChange, name, options, selectedValue, title }) =>
        options.length === 0 ? null : (
          <CustomSelect
            handleChange={handleChange}
            key={name}
            name={name}
            options={options}
            selectedOption={selectedValue}
            title={title}
          />
        ),
      )}
    </StickyFilterBar>
  )
}
