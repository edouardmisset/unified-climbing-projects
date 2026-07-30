'use client'

/* oxlint-disable react/no-multi-comp, no-magic-numbers -- static capture fixtures are intentionally colocated */
import { Skeleton } from 'boneyard-js/react'
import { useSyncExternalStore, type ReactNode } from 'react'
import { Loader, type LoaderVariant } from '../_components/ui/loader/loader'
import styles from './skeleton-catalog.module.css'

const subscribeToClient = () => () => {}

const CAPTURES: { name: `loading-${string}`; fixture: ReactNode; variant: LoaderVariant }[] = [
  { fixture: <PageFixture />, name: 'loading-page', variant: 'page' },
  { fixture: <DashboardFixture />, name: 'loading-dashboard', variant: 'dashboard' },
  { fixture: <FormFixture kind='ascent' />, name: 'loading-ascent-form', variant: 'ascentForm' },
  {
    fixture: <FormFixture kind='training' />,
    name: 'loading-training-form',
    variant: 'trainingForm',
  },
  { fixture: <ListFixture kind='ascent' />, name: 'loading-ascent-list', variant: 'ascentList' },
  {
    fixture: <ListFixture kind='training' />,
    name: 'loading-training-list',
    variant: 'trainingList',
  },
  {
    fixture: <DataCalendarFixture />,
    name: 'loading-data-calendar',
    variant: 'dataCalendar',
  },
  { fixture: <QRCodeFixture />, name: 'loading-qr-code', variant: 'qrCode' },
  { fixture: <BarcodeFixture />, name: 'loading-barcode', variant: 'barcode' },
  { fixture: <ChartFixture />, name: 'loading-chart', variant: 'chart' },
  { fixture: <AscentDetailFixture />, name: 'loading-ascent-detail', variant: 'ascentDetail' },
  { fixture: <TopTenFixture />, name: 'loading-top-ten', variant: 'topTen' },
  { fixture: <IndicatorsFixture />, name: 'loading-indicators', variant: 'indicators' },
  { fixture: <CompactFixture />, name: 'loading-compact', variant: 'compact' },
  {
    fixture: <InlineSummaryFixture />,
    name: 'loading-inline-summary',
    variant: 'inlineSummary',
  },
]

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
      {CAPTURES.map(({ fixture, name }) => (
        <Skeleton fixture={fixture} key={name} loading={false} name={name}>
          {fixture}
        </Skeleton>
      ))}
    </div>
  )
}

function SkeletonPreview() {
  return (
    <div className={styles.catalog}>
      {CAPTURES.map(({ name, variant }) => (
        <section key={name}>
          <h2>{variant}</h2>
          <Loader variant={variant} />
        </section>
      ))}
    </div>
  )
}

function PageFixture() {
  return (
    <section className={styles.page}>
      <h1>Climbing activity</h1>
      <p>Review your climbing history and progress.</p>
      <div className={styles.toolbar}>
        <button type='button'>Previous</button>
        <button type='button'>Next</button>
      </div>
      <ListFixture kind='ascent' />
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
          <article className={styles.card} key={index}>
            <strong>{index + 12}</strong>
            <span>Statistic label</span>
          </article>
        ))}
      </div>
      <div className={styles.charts}>
        <ChartFixture />
        <ChartFixture />
      </div>
    </section>
  )
}

function FormFixture({ kind }: { kind: 'ascent' | 'training' }) {
  const fields = kind === 'ascent' ? 8 : 6
  return (
    <form className={styles.form}>
      <h1>Log {kind}</h1>
      {Array.from({ length: fields }, (_, index) => (
        <label key={index}>
          Field label
          <input placeholder='Field value' readOnly />
        </label>
      ))}
      <button type='button'>Save {kind}</button>
    </form>
  )
}

function ListFixture({ kind }: { kind: 'ascent' | 'training' }) {
  return (
    <div className={styles.list}>
      <div className={styles.toolbar}>
        <button type='button'>Filter {kind}s</button>
        <button type='button'>Sort</button>
      </div>
      {Array.from({ length: 6 }, (_, index) => (
        <article className={styles.listItem} key={index}>
          <strong>{kind === 'ascent' ? `6${index + 1}` : `Training ${index + 1}`}</strong>
          <span>Date · Discipline · {kind === 'ascent' ? 'Crag' : 'Duration'}</span>
        </article>
      ))}
    </div>
  )
}

function DataCalendarFixture() {
  return (
    <section className={styles.calendar}>
      <div className={styles.calendarLabels}>Mon Tue Wed Thu Fri Sat Sun</div>
      <div className={styles.calendarGrid}>
        {Array.from({ length: 53 * 7 }, (_, index) => (
          <span key={index}>{index % 8 === 0 ? '•' : ''}</span>
        ))}
      </div>
    </section>
  )
}

function QRCodeFixture() {
  return (
    <div className={styles.qrCode}>
      {Array.from({ length: 15 * 15 }, (_, index) => (
        <span key={index}>{index % 3 === 0 ? '■' : ''}</span>
      ))}
    </div>
  )
}

function BarcodeFixture() {
  return (
    <div className={styles.barcode}>
      {Array.from({ length: 53 }, (_, index) => (
        <span key={index}>{index % 4 === 0 ? '|' : ''}</span>
      ))}
    </div>
  )
}

function ChartFixture() {
  return (
    <figure className={styles.chart}>
      <div className={styles.chartPlot}>
        {Array.from({ length: 8 }, (_, index) => (
          <span key={index} style={{ blockSize: `${30 + index * 7}%` }} />
        ))}
      </div>
      <figcaption>Chart caption</figcaption>
    </figure>
  )
}

function AscentDetailFixture() {
  return (
    <article className={`${styles.card} ${styles.detail}`}>
      <h2>Ascent grade</h2>
      <p>Crag and route</p>
      <dl>
        <dt>Date</dt>
        <dd>January 1</dd>
        <dt>Style</dt>
        <dd>Lead</dd>
        <dt>Attempts</dt>
        <dd>1</dd>
      </dl>
    </article>
  )
}

function TopTenFixture() {
  return (
    <section className={styles.topTen}>
      <select aria-label='Year' defaultValue='2026'>
        <option>2026</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Ascent</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }, (_, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>Route</td>
              <td>100</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function IndicatorsFixture() {
  return (
    <ol className={styles.indicators}>
      {Array.from({ length: 6 }, (_, index) => (
        <li key={index}>
          <strong>Indicator {index + 1}</strong>
          <span>Measurement and date</span>
        </li>
      ))}
    </ol>
  )
}

function CompactFixture() {
  return (
    <div className={styles.compact}>
      <strong>Loading details</strong>
      <span>Additional information</span>
      <span>Measurement</span>
    </div>
  )
}

function InlineSummaryFixture() {
  return (
    <span className={styles.inlineSummary}>
      <strong>12</strong> days outside and <strong>3.2</strong> ascents per day
    </span>
  )
}
