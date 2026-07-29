import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './public-page-shell.module.css'

type PublicPageShellProps = {
  children: ReactNode
  layout?: 'wide' | 'prose' | 'auth'
}

export function PublicPageShell({ children, layout = 'wide' }: PublicPageShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link className={styles.brand} href='/'>
          <span>Climbing Log</span>
          <span className={styles.beta}>Beta</span>
        </Link>
        <nav aria-label='Public navigation' className={styles.navigation}>
          <Link href='/privacy'>Privacy</Link>
          <Link href='/terms'>Terms</Link>
          <SignedOut>
            <Link className={styles.primaryLink} href='/sign-in'>
              Sign in
            </Link>
          </SignedOut>
          <SignedIn>
            <Link className={styles.primaryLink} href='/wrap-up'>
              Open app
            </Link>
          </SignedIn>
        </nav>
      </header>

      <div className={styles.content} data-layout={layout}>
        {children}
      </div>

      <footer className={styles.footer}>
        <span>Climbing Log · Restricted beta</span>
        <nav aria-label='Legal navigation'>
          <Link href='/privacy'>Privacy</Link>
          <Link href='/terms'>Terms</Link>
        </nav>
      </footer>
    </div>
  )
}
