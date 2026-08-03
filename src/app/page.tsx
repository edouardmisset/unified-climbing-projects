import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { Metadata } from 'next'
import Link from 'next/link'
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
        <p className={styles.eyebrow}>Restricted beta · Invitation only</p>
        <h1>Your climbing history, finally in one place.</h1>
        <p className={styles.lede}>
          Keep ascents and training sessions private, import existing records, and turn years of
          climbing into useful charts and yearly wrap-ups.
        </p>
        <div className={styles.actions}>
          <SignedOut>
            <Link className={styles.primaryAction} href='/sign-in'>
              Sign in
            </Link>
          </SignedOut>
          <SignedIn>
            <Link className={styles.primaryAction} href='/wrap-up'>
              Open your log
            </Link>
          </SignedIn>
          <a href='mailto:edouardmisset@gmail.com'>Request beta access</a>
        </div>
        <ul className={styles.features}>
          <li className='glassPanel'>
            <strong>Private by default</strong>
            <span>Every database operation is scoped to your signed-in identity.</span>
          </li>
          <li className='glassPanel'>
            <strong>Portable data</strong>
            <span>Canonical CSV imports and a browser-generated two-file ZIP export.</span>
          </li>
          <li className='glassPanel'>
            <strong>Built for reflection</strong>
            <span>Dashboards, calendars, indicators, and yearly climbing wrap-ups.</span>
          </li>
        </ul>
      </section>
    </PublicPageShell>
  )
}
