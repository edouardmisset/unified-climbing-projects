import { LegalPage } from '../_components/legal-page/legal-page'

export default function TermsPage() {
  return (
    <LegalPage
      contact={{
        eyebrow: 'Questions?',
        title: 'Talk to a human.',
        body: (
          <p>
            Questions can be sent to{' '}
            <a href='mailto:edouardmisset@gmail.com'>edouardmisset@gmail.com</a>.
          </p>
        ),
      }}
      eyebrow='The essentials'
      sections={[
        {
          heading: 'Keep your exports',
          body: (
            <p>
              This service is an invitation-only beta and may change or be unavailable. Keep your
              own exports. Do not rely on it as the sole copy of important data.
            </p>
          ),
        },
        {
          heading: 'Only import your data',
          body: (
            <p>
              You remain responsible for the records you import. Do not upload data you do not have
              the right to use. Abuse, attempts to access another user’s data, or excessive
              automated use may result in access being removed.
            </p>
          ),
        },
      ]}
      title='Beta terms'
      titleContinuation='Without the fog.'
      updated='Last updated August 2026 · A short, plain-language agreement.'
    />
  )
}
