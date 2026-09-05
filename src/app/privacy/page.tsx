import { LegalPage } from '../_components/legal-page/legal-page'

export default function PrivacyPage() {
  return (
    <LegalPage
      contact={{
        eyebrow: 'Your choices',
        title: 'Access, export, or delete.',
        body: (
          <p>
            To request access, a copy of your data, or account and data deletion, email{' '}
            <a href='mailto:edouardmisset@gmail.com'>edouardmisset@gmail.com</a>.
          </p>
        ),
      }}
      eyebrow='Your records remain yours'
      sections={[
        {
          heading: 'Private by default',
          body: (
            <p>
              Climbing Log is a restricted beta. Account authentication is provided by Clerk and app
              data is stored in Convex. Records are isolated by your Clerk user identifier.
            </p>
          ),
        },
        {
          heading: 'Imports stay local',
          body: (
            <p>
              Imported files are parsed in your browser. The original file is not uploaded or
              logged. Validated climbing rows are sent securely to the app during preview to
              identify duplicates; only records you confirm are stored. Exports are generated in
              your browser.
            </p>
          ),
        },
        {
          heading: 'Essential services',
          body: (
            <p>
              The app is hosted by Vercel and uses its analytics and performance measurement. Vercel
              may process technical request and device information needed to host and measure the
              service.
            </p>
          ),
        },
      ]}
      title='Privacy'
      titleContinuation='In plain language.'
      updated='Last updated August 2026 · How your climbing data is handled.'
    />
  )
}
