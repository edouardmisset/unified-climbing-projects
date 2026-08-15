import { SignedIn, SignedOut } from '@clerk/nextjs'
import { BarChart3, CloudDownload, LockKeyhole } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { PublicPageShell } from './_components/public-page-shell/public-page-shell'
import styles from './landing.module.css'

export const metadata: Metadata = {
  description: 'A private climbing log for ascents, training, imports, and yearly insights.',
  title: 'Climbing Log — Restricted Beta',
}

export default function LandingPage() {
  return (
    <PublicPageShell>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Private climbing journal · Invitation only</p>
          <h1>Every climb tells a story. Keep yours.</h1>
          <p className={styles.lede}>
            One considered home for your ascents, training, and seasons outside—private by default,
            portable forever, and designed for reflection.
          </p>
          <div className={styles.actions}>
            <Suspense fallback={<span className={styles.primaryAction}>Loading</span>}>
              <SignedOut>
                <Link className={styles.primaryAction} href='/sign-in'>
                  Open your log <span aria-hidden='true'>→</span>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link className={styles.primaryAction} href='/wrap-up'>
                  Open your log <span aria-hidden='true'>→</span>
                </Link>
              </SignedIn>
            </Suspense>
            <a className={styles.secondaryAction} href='mailto:edouardmisset@gmail.com'>
              Request beta access
            </a>
          </div>
          <p className={styles.trust}>
            <LockKeyhole aria-hidden='true' /> Your records remain yours.
          </p>
        </div>

        <div aria-label='Example climbing season summary' className={styles.seasonCard}>
          <div className={styles.cardMeta}>
            <span>2026 season</span>
            <span>Updated today</span>
          </div>
          <strong className={styles.ascentCount}>128</strong>
          <span className={styles.ascentLabel}>ascents recorded</span>
          <div aria-hidden='true' className={styles.chart}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <dl className={styles.metrics}>
            <div>
              <dt>Days out</dt>
              <dd>42</dd>
            </div>
            <div>
              <dt>Vertical</dt>
              <dd>1.2 km</dd>
            </div>
            <div>
              <dt>Top grade</dt>
              <dd>7c+</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={styles.featureSection}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Made for the long view</p>
          <h2>Less admin. More perspective.</h2>
        </div>
        <ul className={styles.features}>
          <li>
            <LockKeyhole aria-hidden='true' />
            <span>01</span>
            <strong>Private by default</strong>
            <p>Every operation is scoped to your signed-in identity.</p>
          </li>
          <li>
            <CloudDownload aria-hidden='true' />
            <span>02</span>
            <strong>Always portable</strong>
            <p>Import canonical CSV files and export clean copies at any time.</p>
          </li>
          <li>
            <BarChart3 aria-hidden='true' />
            <span>03</span>
            <strong>Built for reflection</strong>
            <p>See calendars, indicators, and yearly wrap-ups come to life.</p>
          </li>
        </ul>
      </section>
    </PublicPageShell>
  )
}
