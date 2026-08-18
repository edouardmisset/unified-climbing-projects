import Link from 'next/link'
import { PublicPageShell } from '../_components/public-page-shell/public-page-shell'
import styles from '../legal.module.css'

export default function TermsPage() {
  return (
    <PublicPageShell layout='prose'>
      <article className={`${styles.article} glassPanel`}>
        <header className={styles.articleHeader}>
          <p className={styles.eyebrow}>The essentials</p>
          <h1>Beta terms</h1>
          <p className={styles.titleContinuation}>Without the fog.</p>
          <p>Last updated August 2026 · A short, plain-language agreement.</p>
        </header>
        <section>
          <span aria-hidden='true' className={styles.number}>
            01
          </span>
          <div>
            <h2>Keep your exports</h2>
            <p>
              This service is an invitation-only beta and may change or be unavailable. Keep your
              own exports. Do not rely on it as the sole copy of important data.
            </p>
          </div>
        </section>
        <section>
          <span aria-hidden='true' className={styles.number}>
            02
          </span>
          <div>
            <h2>Only import your data</h2>
            <p>
              You remain responsible for the records you import. Do not upload data you do not have
              the right to use. Abuse, attempts to access another user’s data, or excessive
              automated use may result in access being removed.
            </p>
          </div>
        </section>
        <aside className={styles.contact}>
          <p className={styles.eyebrow}>Questions?</p>
          <h2>Talk to a human.</h2>
          <p>
            Questions can be sent to{' '}
            <a href='mailto:edouardmisset@gmail.com'>edouardmisset@gmail.com</a>.
          </p>
        </aside>
        <Link className={styles.backLink} href='/'>
          ← Return home
        </Link>
      </article>
    </PublicPageShell>
  )
}
