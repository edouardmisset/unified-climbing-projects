import type { Metadata } from 'next'
import { Suspense } from 'react'
import { IndicatorsTimeline } from '~/app/indicators/indicators-timeline'
import styles from '~/app/indicators/page.module.css'
import Layout from '~/app/_components/page-layout/page-layout'
import { Loader } from '~/app/_components/ui/loader/loader'

export default function AscentsIndicatorsPage() {
  return (
    <Layout gridClassName={styles.container} layout='flexRow' title='Indicators'>
      <Suspense fallback={<Loader />}>
        <IndicatorsTimeline />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Track climbing indicators and progress over time.',
  title: 'Indicators · Ascents',
}
