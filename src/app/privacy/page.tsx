import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <article>
      <h1>Privacy</h1>
      <p>
        Climbing Log is a restricted beta. Account authentication is provided by Clerk and app data
        is stored in Convex. Records are isolated by your Clerk user identifier.
      </p>
      <p>
        Imported files are parsed in your browser. The original file is not uploaded or logged.
        Validated climbing rows are sent securely to the app during preview to identify duplicates;
        only records you confirm are stored. Exports are generated in your browser.
      </p>
      <p>
        The app is hosted by Vercel and uses its analytics and performance measurement. Vercel may
        process technical request and device information needed to host and measure the service.
      </p>
      <p>
        To request access, a copy of your data, or account and data deletion, email{' '}
        <a href="mailto:edouardmisset@gmail.com">edouardmisset@gmail.com</a>.
      </p>
      <p>
        <Link href="/">Return home</Link>
      </p>
    </article>
  )
}
