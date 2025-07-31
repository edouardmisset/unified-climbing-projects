import { CircleX } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './sticky-filter-bar.module.css'

export function StickyFilterBar({
  children,
  clearFilters,
  isOneFilterActive,
}: {
  children: ReactNode
  clearFilters?: () => void
  isOneFilterActive?: boolean
}) {
  return (
    <search className={styles.container}>
      <div className={styles.background} />
      <div className={styles.edge} />
      <div className={styles.filters}>
        {children}
        <button
          className={styles.reset}
          disabled={!isOneFilterActive}
          onClick={clearFilters}
          title="Clear filters"
          type="reset"
        >
          <CircleX opacity={isOneFilterActive ? 1 : 0.5} />
          <span className="visually-hidden">Clear filters</span>
        </button>
      </div>
    </search>
  )
}
