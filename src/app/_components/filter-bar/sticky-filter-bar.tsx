import { CircleX } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { CustomSelect } from '../custom-select/custom-select'
import { ALL_VALUE } from '../dashboard/constants'
import styles from './sticky-filter-bar.module.css'
import type { BaseFilterBarProps } from './types'

export function StickyFilterBar({ filters }: BaseFilterBarProps) {
  const clearFilters = useCallback(() => {
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
    <search className={styles.container}>
      <div className={styles.background} />
      <div className={styles.edge} />
      <div className={styles.filters}>
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
        <button
          className={styles.reset}
          disabled={!isOneFilterActive}
          onClick={clearFilters}
          title="Clear filters"
          type="reset"
        >
          <CircleX opacity={isOneFilterActive ? 1 : 0.5} />
          <span className="visuallyHidden">Clear filters</span>
        </button>
      </div>
    </search>
  )
}
