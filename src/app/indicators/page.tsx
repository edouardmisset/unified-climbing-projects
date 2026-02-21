import { Suspense } from 'react'
import { Loader } from '../_components/loader/loader'
import Layout from '../_components/page-layout/page-layout'
import { IndicatorsTimeline } from './indicators-timeline'
import styles from './page.module.css'
import type { Metadata } from 'next'

export const revalidate = 86400

export default async function Page() {
  return (
    <Layout gridClassName={styles.container} layout='flexRow' title='Indicators'>
      <Suspense fallback={<Loader />}>
        <IndicatorsTimeline />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  title: 'Indicators',
  keywords: ['climbing', 'training', 'indicators', 'progress'],
  description: 'Track your training indicators and progress over time.',
}
