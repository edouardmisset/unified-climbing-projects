import { Drawer } from '@base-ui/react/drawer'
import { CircleX, ListFilter } from 'lucide-react'
import { useState, useTransition } from 'react'
import { ALL_VALUE } from '../dashboard/constants'
import { FilterSelectList, MobileFilterSheet } from './mobile-filter-sheet'
import { SearchInput } from './search-input'
import type { BaseFilterBarProps } from './types'
import styles from './sticky-filter-bar.module.css'

export function StickyFilterBar({ filters, search, setSearch, showSearch }: BaseFilterBarProps) {
  const [isPending, startTransition] = useTransition()
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)

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

  const activeFilterCount =
    filters.filter(filter => displayedSelectedValueByName[filter.name] !== ALL_VALUE).length +
    Number(search !== undefined && search !== '')

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
            id='filter-bar-search-route'
            key={search}
            search={search}
            setSearch={setSearch}
            startTransition={startTransition}
            onDraftChange={setHasDraftSearch}
          />
        )}
        <FilterSelectList filters={renderedFilters} idPrefix='filter-bar-' />
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
      <div className={styles.mobileControls}>
        <Drawer.Root
          onOpenChange={setIsFilterSheetOpen}
          open={isFilterSheetOpen}
          swipeDirection='down'
        >
          <Drawer.Trigger aria-label='Open filters' className={styles.mobileTrigger}>
            <ListFilter aria-hidden size={18} />
            <span>{`Filters · ${activeFilterCount}`}</span>
          </Drawer.Trigger>
          <button
            aria-label='Clear filters'
            className={styles.mobileReset}
            disabled={!isOneFilterActive}
            onClick={clearFilters}
            type='reset'
          >
            <CircleX aria-hidden opacity={isOneFilterActive ? 1 : 1 / 2} size={18} />
          </button>
          <Drawer.Portal>
            <Drawer.Backdrop className={styles.sheetBackdrop} />
            <MobileFilterSheet
              filters={renderedFilters}
              searchInput={
                setSearch === undefined || search === undefined || !showSearch ? undefined : (
                  <SearchInput
                    id='filter-sheet-search-route'
                    key={search}
                    search={search}
                    setSearch={setSearch}
                    startTransition={startTransition}
                    onDraftChange={setHasDraftSearch}
                  />
                )
              }
            />
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </search>
  )
}
