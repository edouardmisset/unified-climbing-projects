import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './landing.module.css'

export const metadata: Metadata = {
  description: 'A private climbing log for ascents, training, imports, and yearly insights.',
  title: 'Climbing Log — Restricted Beta',
}

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          Climbing Log <span>Beta</span>
        </Link>
        <nav aria-label="Public navigation">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <SignedOut>
            <Link href="/sign-in">Sign in</Link>
          </SignedOut>
          <SignedIn>
            <Link className={styles.primaryLink} href="/wrap-up">
              Open app
            </Link>
          </SignedIn>
        </nav>
      </header>

      <main className={styles.hero}>
        <p className={styles.eyebrow}>Restricted beta · Invitation only</p>
        <h1>Your climbing history, finally in one place.</h1>
        <p className={styles.lede}>
          Keep ascents and training sessions private, import existing records, and turn years of
          climbing into useful charts and yearly wrap-ups.
        </p>
        <div className={styles.actions}>
          <SignedOut>
            <Link className={styles.primaryLink} href="/sign-in">
              Sign in
            </Link>
          </SignedOut>
          <SignedIn>
            <Link className={styles.primaryLink} href="/wrap-up">
              Open your log
            </Link>
          </SignedIn>
          <a href="mailto:edouardmisset@gmail.com">Request beta access</a>
        </div>
        <ul className={styles.features}>
          <li>
            <strong>Private by default</strong>
            <span>Every database operation is scoped to your signed-in identity.</span>
          </li>
          <li>
            <strong>Portable data</strong>
            <span>Canonical CSV imports and a browser-generated two-file ZIP export.</span>
          </li>
          <li>
            <strong>Built for reflection</strong>
            <span>Dashboards, calendars, indicators, and yearly climbing wrap-ups.</span>
          </li>
        </ul>
      </main>
    </div>
  )
}
