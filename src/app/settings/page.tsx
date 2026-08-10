import type { Metadata } from 'next'
import { Suspense } from 'react'
import Layout from '~/app/_components/page-layout/page-layout'
import { Card } from '~/app/_components/ui/card/card'
import { Loader } from '~/app/_components/ui/loader/loader'
import { ExportData } from './export-data'
import { ImportData } from './import-data'
import styles from './settings.module.css'

export default function SettingsPage() {
  return (
    <Layout gridClassName={styles.settings} layout='flexColumn' title='Settings'>
      <section className={styles.section} id='import'>
        <Card>
          <h2 className={styles.sectionTitle}>Import your data</h2>
          <div className={styles.introduction}>
            <p>
              Files are parsed in your browser. The original file is never uploaded or logged;
              validated canonical rows are sent securely to the app for duplicate matching during
              preview. Only confirmed records are stored, in atomic batches.
            </p>
            <p>
              For 8a.nu, download your climbing-data CSV export and select “8a.nu data export”
              below. Routes and boulders, ascent style, grade, attempts, rating, height, crag,
              sector, date, and comments are converted to the canonical format.
            </p>
          </div>
          <Suspense fallback={<Loader />}>
            <ImportData />
          </Suspense>
        </Card>
      </section>

      <section className={styles.section} id='export'>
        <Card>
          <h2 className={styles.sectionTitle}>Export your data</h2>
          <p>
            The export is generated in this browser and contains exactly <code>ascents.csv</code>{' '}
            and <code>training-sessions.csv</code>.
          </p>
          <Suspense fallback={<Loader />}>
            <ExportData />
          </Suspense>
        </Card>
      </section>

      <section className={styles.section} id='account'>
        <Card>
          <h2 className={styles.sectionTitle}>Account and deletion</h2>
          <p>
            To request account support or permanent deletion of your account and records, email{' '}
            <a href='mailto:edouardmisset@gmail.com'>edouardmisset@gmail.com</a>.
          </p>
        </Card>
      </section>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Import, export, and manage your climbing log account.',
  title: 'Settings ⚙️',
}
