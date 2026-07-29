'use client'

import { Skeleton } from 'boneyard-js/react'
import styles from './loader.module.css'

const BONE_NAMES = {
  compact: 'loading-compact',
  dashboard: 'loading-dashboard',
  form: 'loading-form',
  list: 'loading-list',
  page: 'loading-page',
} as const

export type LoaderVariant = keyof typeof BONE_NAMES

export function Loader({
  compact = false,
  variant = 'page',
}: {
  compact?: boolean
  variant?: Exclude<LoaderVariant, 'compact'>
}) {
  const resolvedVariant = compact ? 'compact' : variant

  return (
    <output aria-label='Loading' className={styles.loader}>
      <Skeleton
        animate='shimmer'
        className={styles[resolvedVariant]}
        fallback={<span className={styles.fallback}>Loading…</span>}
        loading
        name={BONE_NAMES[resolvedVariant]}
        select='container'
      >
        <span />
      </Skeleton>
    </output>
  )
}
