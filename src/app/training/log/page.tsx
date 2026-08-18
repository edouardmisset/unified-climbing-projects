import type { Metadata } from 'next'
import Layout from '~/app/_components/page-layout/page-layout'
import { LogFormWrapper } from '~/app/log/log-form-wrapper'

export default function TrainingLogPage() {
  return (
    <Layout gridClassName='padding' title='Log training'>
      <LogFormWrapper defaultScope='training' />
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Log a training session, climbing ascents, or both.',
  title: 'Log · Training',
}
