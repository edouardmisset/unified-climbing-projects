'use client'

import { useEffect } from 'react'
import styles from './loader.module.css'

const SKELETON_ROW_COUNT = 4

export function Loader({ compact = false }: { compact?: boolean }) {
  useEffect(() => {
    void import('@aejkatappaja/phantom-ui')
  }, [])

  return (
    <output aria-label='Loading' className={`${styles.loader} ${compact ? styles.compact : ''}`}>
      <phantom-ui
        animation='shimmer'
        count={compact ? 1 : SKELETON_ROW_COUNT}
        count-gap={12}
        loading
        loading-label='Loading'
      >
        {compact ? (
          <span className={styles.inlineTemplate}>Loading content</span>
        ) : (
          <article className={styles.template}>
            <h2>Loading climbing activity</h2>
            <p>Preparing your latest climbing statistics and activity.</p>
            <p>Loading route details</p>
          </article>
        )}
      </phantom-ui>
    </output>
  )
}
