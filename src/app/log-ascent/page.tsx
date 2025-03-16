import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader.tsx'
import { SignInButton } from '~/app/_components/sign-in-button/sign-in-button.tsx'
import AscentForm from './_components/ascent-form.tsx'
import styles from './page.module.css'

export default async function Log() {
  return (
    <Suspense fallback={<Loader />}>
      <SignedIn>
        <section className={styles.container}>
          <h1 className={styles.title}>Congrats 🎉</h1>
          <span className="visually-hidden" aria-describedby="form-description">
            Form to log a climbing ascent
          </span>
          <Suspense fallback={<Loader />}>
            <AscentForm />
          </Suspense>
        </section>
      </SignedIn>
      <SignedOut>
        <section className={styles.container}>
          <p>You need to be signed in to log an ascent.</p>
          <SignInButton />
        </section>
      </SignedOut>
    </Suspense>
  )
}

export const metadata: Metadata = {
  title: 'Log ascent 📋',
  description:
    'Log an outdoor climbing ascent (boulder, route, or multi-pitch)',
  keywords: ['climbing', 'route', 'boulder', 'outdoor', 'multi-pitch', 'log'],
}
