import { SignedIn, SignedOut } from '@clerk/nextjs'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader.tsx'
import { SignInButton } from '~/app/_components/sign-in-button/sign-in-button.tsx'
import TrainingSessionForm from './_components/training-session-form.tsx'
import styles from './page.module.css'

export default async function LogTrainingSession() {
  return (
    <Suspense fallback={<Loader />}>
      <SignedIn>
        <section className={styles.container}>
          <h1 className={styles.title}>Training Hard 💪</h1>
          <span className="visually-hidden" aria-describedby="form-description">
            Form to log a training session
          </span>
          <Suspense fallback={<Loader />}>
            <TrainingSessionForm />
          </Suspense>
        </section>
      </SignedIn>
      <div className={styles.container}>
        <SignedOut>
          <p>You need to be signed in to log a training session.</p>
          <SignInButton />
        </SignedOut>
      </div>
    </Suspense>
  )
}
