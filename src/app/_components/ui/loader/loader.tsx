'use client'

import { Skeleton } from 'boneyard-js/react'
import styles from './loader.module.css'

const BONE_NAMES = {
  ascentDetail: 'loading-ascent-detail',
  ascentForm: 'loading-ascent-form',
  ascentList: 'loading-ascent-list',
  barcode: 'loading-barcode',
  chart: 'loading-chart',
  compact: 'loading-compact',
  dataCalendar: 'loading-data-calendar',
  dashboard: 'loading-dashboard',
  indicators: 'loading-indicators',
  inlineSummary: 'loading-inline-summary',
  page: 'loading-page',
  qrCode: 'loading-qr-code',
  topTen: 'loading-top-ten',
  trainingForm: 'loading-training-form',
  trainingList: 'loading-training-list',
} as const

export type LoaderVariant = keyof typeof BONE_NAMES

export function Loader({ variant = 'page' }: { variant?: LoaderVariant }) {
  return (
    <output aria-label='Loading' className={`${styles.loader} ${styles[variant]}`}>
      <Skeleton
        animate='shimmer'
        fallback={<span className={styles.fallback}>Loading…</span>}
        loading
        name={BONE_NAMES[variant]}
        select='container'
      >
        <span />
      </Skeleton>
    </output>
  )
}
