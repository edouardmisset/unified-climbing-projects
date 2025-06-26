import type { ReactNode } from 'react'
import styles from './sticky-filter-bar.module.css'

export function StickyFilterBar({ children }: { children: ReactNode }) {
  return (
    <search className={styles.container}>
      <div className={styles.background} />
      <div className={styles.edge} />
      <div className={styles.filters}>{children}</div>
    </search>
  )
}
