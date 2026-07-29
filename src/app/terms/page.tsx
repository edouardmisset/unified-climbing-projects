import Link from 'next/link'
import { PublicPageShell } from '../_components/public-page-shell/public-page-shell'
import styles from '../legal.module.css'

export default function TermsPage() {
  return (
    <PublicPageShell layout="prose">
      <article className={styles.article}>
        <h1>Beta terms</h1>
        <p>
          This service is an invitation-only beta and may change or be unavailable. Keep your own
          exports. Do not rely on it as the sole copy of important data.
        </p>
        <p>
          You remain responsible for the records you import. Do not upload data you do not have the
          right to use. Abuse, attempts to access another user’s data, or excessive automated use
          may result in access being removed.
        </p>
        <p>
          Questions can be sent to{' '}
          <a href="mailto:edouardmisset@gmail.com">edouardmisset@gmail.com</a>.
        </p>
        <p>
          <Link href="/">Return home</Link>
        </p>
      </article>
    </PublicPageShell>
  )
}
