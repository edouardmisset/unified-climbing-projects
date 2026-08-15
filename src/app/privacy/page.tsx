import Link from 'next/link'
import { PublicPageShell } from '../_components/public-page-shell/public-page-shell'
import styles from '../legal.module.css'

export default function PrivacyPage() {
  return (
    <PublicPageShell layout='prose'>
      <article className={`${styles.article} glassPanel`}>
        <header className={styles.articleHeader}>
          <p className={styles.eyebrow}>Your records remain yours</p>
          <h1>Privacy</h1>
          <p className={styles.titleContinuation}>In plain language.</p>
          <p>Last updated August 2026 · How your climbing data is handled.</p>
        </header>
<section>
  <span aria-hidden='true' className={styles.number}>01</span>
  <div>
            <h2>Private by default</h2>
            <p>
              Climbing Log is a restricted beta. Account authentication is provided by Clerk and app
              data is stored in Convex. Records are isolated by your Clerk user identifier.
            </p>
          </div>
        </section>
        <section>
          <span className={styles.number}>02</span>
          <div>
            <h2>Imports stay local</h2>
            <p>
              Imported files are parsed in your browser. The original file is not uploaded or
              logged. Validated climbing rows are sent securely to the app during preview to
              identify duplicates; only records you confirm are stored. Exports are generated in
              your browser.
            </p>
          </div>
        </section>
        <section>
          <span className={styles.number}>03</span>
          <div>
            <h2>Essential services</h2>
            <p>
              The app is hosted by Vercel and uses its analytics and performance measurement. Vercel
              may process technical request and device information needed to host and measure the
              service.
            </p>
          </div>
        </section>
        <aside className={styles.contact}>
          <p className={styles.eyebrow}>Your choices</p>
          <h2>Access, export, or delete.</h2>
          <p>
            To request access, a copy of your data, or account and data deletion, email{' '}
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
