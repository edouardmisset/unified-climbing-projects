import type { Metadata } from 'next'
import { CloudDownload, ShieldCheck, Upload } from 'lucide-react'
import { Suspense } from 'react'
import Layout from '~/app/_components/page-layout/page-layout'
import { Loader } from '~/app/_components/ui/loader/loader'
import { ExportData } from './export-data'
import { ImportData } from './import-data'
import styles from './settings.module.css'

export default function SettingsPage() {
  return (
    <Layout gridClassName={styles.settings} layout='flexColumn' title='Settings'>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Your climbing archive</p>
        <h2>Your data, clearly managed.</h2>
        <p>Bring your history with you, keep a copy, or get help with your account.</p>
      </div>
      <div className={styles.settingsLayout}>
        <nav aria-label='Settings sections' className={styles.localNavigation}>
          <a href='#import'>Import data</a>
          <a href='#export'>Export data</a>
          <a href='#account'>Account</a>
        </nav>
        <div className={styles.sections}>
          <section className={styles.section} id='import'>
            <div className={styles.panel}>
              <div className={styles.sectionHeader}>
                <span>
                  <Upload aria-hidden='true' />
                </span>
                <div>
                  <p className={styles.eyebrow}>Bring your history</p>
                  <h2>Import your data</h2>
                </div>
              </div>
              <div className={styles.introduction}>
                <p>
                  Files are parsed in your browser. The original file is never uploaded or logged;
                  validated canonical rows are sent securely to the app for duplicate matching
                  during preview. Only confirmed records are stored, in atomic batches.
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
            </div>
          </section>

          <section className={styles.section} id='export'>
            <div className={styles.panel}>
              <div className={styles.sectionHeader}>
                <span>
                  <CloudDownload aria-hidden='true' />
                </span>
                <div>
                  <p className={styles.eyebrow}>Keep a copy</p>
                  <h2>Export your data</h2>
                </div>
              </div>
              <p>
                Choose a CSV or JSON download for each dataset. Exports are generated in this
                browser and include your records, not internal database identifiers.
              </p>
              <Suspense fallback={<Loader />}>
                <ExportData />
              </Suspense>
            </div>
          </section>

          <section className={styles.section} id='account'>
            <div className={styles.panel}>
              <div className={styles.sectionHeader}>
                <span>
                  <ShieldCheck aria-hidden='true' />
                </span>
                <div>
                  <p className={styles.eyebrow}>Support and privacy</p>
                  <h2>Account and deletion</h2>
                </div>
              </div>
              <p>
                To request account support or permanent deletion of your account and records, email{' '}
                <a href='mailto:edouardmisset@gmail.com'>edouardmisset@gmail.com</a>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Import, export, and manage your climbing log account.',
  title: 'Settings ⚙️',
}
