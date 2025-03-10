import { SignedIn, SignedOut } from '@clerk/nextjs'
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
      <div className={styles.container}>
        <SignedOut>
          <p>You need to be signed in to log an ascent.</p>
          <SignInButton />
        </SignedOut>
      </div>
    </Suspense>
  )
}
