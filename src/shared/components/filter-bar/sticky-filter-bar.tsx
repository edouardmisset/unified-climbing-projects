import { CircleX } from 'lucide-react'
import { memo, useCallback, useMemo, useState, useTransition } from 'react'
import { CustomInput } from '../ui/custom-input/custom-input'
import { CustomSelect } from '../custom-select/custom-select'
import { ALL_VALUE } from '../dashboard/constants'
import type { BaseFilterBarProps } from './types'
import styles from './sticky-filter-bar.module.css'

export function StickyFilterBar({ filters, search, setSearch, showSearch }: BaseFilterBarProps) {
  const [isPending, startTransition] = useTransition()

  const selectedValueByName = useMemo(
    () =>
      Object.fromEntries(filters.map(({ name, selectedValue }) => [name, selectedValue])) as Record<
        string,
        string
      >,
    [filters],
  )

  const [localSelectedValueByName, setLocalSelectedValueByName] =
    useState<Record<string, string>>(selectedValueByName)
  const [localSearch, setLocalSearch] = useState(search ?? '')

  const displayedSelectedValueByName = isPending ? localSelectedValueByName : selectedValueByName
  const displayedSearch = isPending ? localSearch : (search ?? '')

  const applyFilterValue = useCallback(
    (filterName: string, value: string) => {
      const matchingFilter = filters.find(({ name }) => name === filterName)
      if (matchingFilter === undefined) return

      setLocalSelectedValueByName(previousValues => ({
        ...previousValues,
        [filterName]: value,
      }))

      startTransition(() => {
        matchingFilter.setValue(value)
      })
    },
    [filters, startTransition],
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value)

      if (setSearch === undefined) return

      startTransition(() => {
        setSearch(value)
      })
    },
    [setSearch, startTransition],
  )

  const clearFilters = useCallback(() => {
    setLocalSelectedValueByName(
      Object.fromEntries(filters.map(({ name }) => [name, ALL_VALUE])) as Record<string, string>,
    )
    setLocalSearch('')

    startTransition(() => {
      for (const filter of filters) filter.setValue(ALL_VALUE)

      if (setSearch !== undefined) setSearch('')
    })
  }, [filters, setSearch, startTransition])

  const isOneFilterActive = useMemo(
    () =>
      filters.some(filter => displayedSelectedValueByName[filter.name] !== ALL_VALUE) ||
      displayedSearch !== '',
    [displayedSearch, displayedSelectedValueByName, filters],
  )

  const renderedFilters = useMemo(
    () =>
      filters.map(filter => ({
        ...filter,
        handleChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
          applyFilterValue(filter.name, event.target.value),
        selectedValue: displayedSelectedValueByName[filter.name] ?? filter.selectedValue,
      })),
    [applyFilterValue, displayedSelectedValueByName, filters],
  )

  return (
    <search aria-busy={isPending} className={styles.container}>
      <div className={styles.background} />
      <div className={styles.edge} />
      <div className={`${styles.filters} ${isPending ? styles.filtersPending : ''}`}>
        {setSearch === undefined || search === undefined || !showSearch ? undefined : (
          <CustomInput
            name='search route'
            onChange={event => handleSearchChange(event.target.value)}
            placeholder='Biographie'
            type='search'
            value={displayedSearch}
          />
        )}
        <FilterSelectList filters={renderedFilters} />
        <button
          className={styles.reset}
          disabled={!isOneFilterActive}
          onClick={clearFilters}
          title='Clear filters'
          type='reset'
        >
          <CircleX opacity={isOneFilterActive ? 1 : 1 / 2} />
          <span className='visuallyHidden'>Clear filters</span>
        </button>
      </div>
    </search>
  )
}

type RenderedFilter = BaseFilterBarProps['filters'][number] & {
  handleChange: React.ChangeEventHandler<HTMLSelectElement>
  selectedValue: string
}

const FilterSelectList = memo(({ filters }: { filters: RenderedFilter[] }) =>
  filters.map(({ handleChange, name, options, selectedValue, title }) =>
    options.length === 0 ? undefined : (
      <CustomSelect
        handleChange={handleChange}
        key={name}
        name={name}
        options={options}
        selectedOption={selectedValue}
        title={title}
      />
    ),
  ),
)
