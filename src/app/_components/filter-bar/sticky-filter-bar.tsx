import { CircleX } from 'lucide-react'
import { useState, useTransition } from 'react'
import { CustomSelect } from '../custom-select/custom-select'
import { ALL_VALUE } from '../dashboard/constants'
import { SearchInput } from './search-input'
import type { BaseFilterBarProps } from './types'
import styles from './sticky-filter-bar.module.css'

export function StickyFilterBar({ filters, search, setSearch, showSearch }: BaseFilterBarProps) {
  const [isPending, startTransition] = useTransition()

  const selectedValueByName = Object.fromEntries(
    filters.map(({ name, selectedValue }) => [name, selectedValue]),
  ) as Record<string, string>

  const [localSelectedValueByName, setLocalSelectedValueByName] =
    useState<Record<string, string>>(selectedValueByName)
  const [hasDraftSearch, setHasDraftSearch] = useState(false)

  const displayedSelectedValueByName = isPending ? localSelectedValueByName : selectedValueByName

  const applyFilterValue = (filterName: string, value: string) => {
    const matchingFilter = filters.find(({ name }) => name === filterName)
    if (matchingFilter === undefined) return

    setLocalSelectedValueByName(previousValues => ({
      ...previousValues,
      [filterName]: value,
    }))

    startTransition(() => {
      matchingFilter.setValue(value)
    })
  }

  const clearFilters = () => {
    setLocalSelectedValueByName(Object.fromEntries(filters.map(({ name }) => [name, ALL_VALUE])))
    setHasDraftSearch(false)

    startTransition(() => {
      for (const filter of filters) filter.setValue(ALL_VALUE)

      if (setSearch !== undefined) setSearch('')
    })
  }

  const isOneFilterActive =
    filters.some(filter => displayedSelectedValueByName[filter.name] !== ALL_VALUE) ||
    (search !== undefined && search !== '') ||
    hasDraftSearch

  const renderedFilters = filters.map(filter => ({
    ...filter,
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
      applyFilterValue(filter.name, event.target.value)
    },
    selectedValue: displayedSelectedValueByName[filter.name] ?? filter.selectedValue,
  }))

  return (
    <search aria-busy={isPending} className={styles.container}>
      <div className={styles.background} />
      <div className={styles.edge} />
      <div className={`${styles.filters} ${isPending ? styles.filtersPending : ''}`}>
        {setSearch === undefined || search === undefined || !showSearch ? undefined : (
          <SearchInput
            key={search}
            search={search}
            setSearch={setSearch}
            startTransition={startTransition}
            onDraftChange={setHasDraftSearch}
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

const FilterSelectList = ({ filters }: { filters: RenderedFilter[] }) =>
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
  )
