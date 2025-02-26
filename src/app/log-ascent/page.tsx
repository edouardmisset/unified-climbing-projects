import { SignInButton } from '@clerk/nextjs'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader.tsx'
import Form from './_components/form.tsx'
import styles from './page.module.css'

export default async function Log() {
  return (
    <>
      <SignedIn>
        <section className={styles.container}>
          <h1 className={styles.title}>Congrats 🎉</h1>
          <span className="visually-hidden" aria-describedby="form-description">
            Form to log a climbing ascent
          </span>
          <Suspense fallback={<Loader />}>
            <Form />
          </Suspense>
        </section>
      </SignedIn>
      <SignedOut>
        <p>You need to be signed in to log an ascent.</p>
        <SignInButton />
      </SignedOut>
    </>
  )
}
