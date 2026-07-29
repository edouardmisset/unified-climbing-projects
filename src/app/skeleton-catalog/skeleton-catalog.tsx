'use client'

/* oxlint-disable react/no-multi-comp, no-magic-numbers -- static capture fixtures are intentionally colocated */
import { Skeleton } from 'boneyard-js/react'
import { useSyncExternalStore } from 'react'
import { Loader, type LoaderVariant } from '../_components/ui/loader/loader'
import styles from './skeleton-catalog.module.css'

const subscribeToClient = () => () => {}

export function SkeletonCatalog({ preview = false }: { preview?: boolean }) {
  const isMounted = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  )

  if (!isMounted) return <p>Preparing skeleton catalog…</p>
  if (preview) return <SkeletonPreview />

  return (
    <div className={styles.catalog}>
      <Skeleton fixture={<PageFixture />} loading={false} name='loading-page'>
        <PageFixture />
      </Skeleton>
      <Skeleton fixture={<DashboardFixture />} loading={false} name='loading-dashboard'>
        <DashboardFixture />
      </Skeleton>
      <Skeleton fixture={<FormFixture />} loading={false} name='loading-form'>
        <FormFixture />
      </Skeleton>
      <Skeleton fixture={<ListFixture />} loading={false} name='loading-list'>
        <ListFixture />
      </Skeleton>
      <Skeleton fixture={<CompactFixture />} loading={false} name='loading-compact'>
        <CompactFixture />
      </Skeleton>
    </div>
  )
}

function SkeletonPreview() {
  const variants: LoaderVariant[] = ['page', 'dashboard', 'form', 'list', 'compact']

  return (
    <div className={styles.catalog}>
      {variants.map(variant => (
        <section key={variant}>
          <h2>{variant}</h2>
          <Loader
            compact={variant === 'compact'}
            variant={variant === 'compact' ? 'page' : variant}
          />
        </section>
      ))}
    </div>
  )
}

function PageFixture() {
  return (
    <section className={styles.page}>
      <h1>Climbing activity</h1>
      <p>Review your recent ascents and training sessions.</p>
      <div className={styles.toolbar}>
        <button type='button'>Previous</button>
        <button type='button'>Next</button>
      </div>
      <ListFixture />
    </section>
  )
}

function DashboardFixture() {
  return (
    <section className={styles.dashboard}>
      <div className={styles.toolbar}>
        <button type='button'>All disciplines</button>
        <button type='button'>This year</button>
      </div>
      <div className={styles.statistics}>
        {Array.from({ length: 4 }, (_, index) => (
          <article className={styles.statistic} key={index}>
            <strong>{index + 12}</strong>
            <span>Statistic label</span>
          </article>
        ))}
      </div>
      <div className={styles.charts}>
        <article>
          <h2>Ascents over time</h2>
          <div className={styles.chart} />
        </article>
        <article>
          <h2>Grade distribution</h2>
          <div className={styles.chart} />
        </article>
      </div>
    </section>
  )
}

function FormFixture() {
  return (
    <form className={styles.form}>
      <h1>Log climbing activity</h1>
      {Array.from({ length: 6 }, (_, index) => (
        <label key={index}>
          Field label
          <input placeholder='Field value' readOnly />
        </label>
      ))}
      <button type='button'>Save activity</button>
    </form>
  )
}

function ListFixture() {
  return (
    <div className={styles.list}>
      {Array.from({ length: 6 }, (_, index) => (
        <article className={styles.listItem} key={index}>
          <strong>Climbing entry {index + 1}</strong>
          <span>Grade · Location · Date</span>
        </article>
      ))}
    </div>
  )
}

function CompactFixture() {
  return (
    <span className={styles.compact}>
      <strong>Loading details</strong>
      <span>Climbing data</span>
    </span>
  )
}
