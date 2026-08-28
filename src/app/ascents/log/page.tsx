import type { Metadata } from 'next'
import Layout from '~/app/_components/page-layout/page-layout'
import { LogFormWrapper } from '~/app/log/log-form-wrapper'

export default function AscentsLogPage() {
  return (
    <Layout gridClassName='padding' title='Log'>
      <LogFormWrapper defaultScope='ascents' />
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Log a climbing ascent, a training session, or both.',
  title: 'Log',
}
