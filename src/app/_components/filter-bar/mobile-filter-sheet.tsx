import { Drawer } from '@base-ui/react/drawer'
import { XIcon } from 'lucide-react'
import type { ChangeEventHandler, ReactNode } from 'react'
import { CustomSelect } from '../custom-select/custom-select'
import type { BaseFilterBarProps } from './types'
import styles from './sticky-filter-bar.module.css'

export type RenderedFilter = BaseFilterBarProps['filters'][number] & {
  handleChange: ChangeEventHandler<HTMLSelectElement>
  selectedValue: string
}

export function MobileFilterSheet({
  filters,
  searchInput,
}: {
  filters: RenderedFilter[]
  searchInput: ReactNode
}) {
  return (
    <Drawer.Viewport className={styles.sheetViewport}>
      <Drawer.Popup className={styles.sheetPopup}>
        <Drawer.Content className={styles.sheetContent}>
          <div className={styles.sheetHeader}>
            <Drawer.Title className={styles.sheetTitle}>Filters</Drawer.Title>
            <Drawer.Close aria-label='Close filters' className={styles.sheetClose}>
              <XIcon aria-hidden size={18} />
            </Drawer.Close>
          </div>
          <div className={styles.sheetFilters}>
            {searchInput}
            <FilterSelectList filters={filters} idPrefix='filter-sheet-' />
          </div>
        </Drawer.Content>
      </Drawer.Popup>
    </Drawer.Viewport>
  )
}

export const FilterSelectList = ({
  filters,
  idPrefix,
}: {
  filters: RenderedFilter[]
  idPrefix: string
}) =>
  filters.map(({ handleChange, name, options, selectedValue, title }) =>
    options.length === 0 ? undefined : (
      <CustomSelect
        handleChange={handleChange}
        id={`${idPrefix}${name}`}
        key={name}
        name={name}
        options={options}
        selectedOption={selectedValue}
        title={title}
      />
    ),
  )
