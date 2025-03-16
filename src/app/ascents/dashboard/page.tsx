import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Dashboard } from '~/app/_components/dashboard/dashboard'
import { Loader } from '~/app/_components/loader/loader'
import styles from './page.module.css'

export default function Page() {
  return (
    <div className={styles.container}>
      <h1 className="super-center">Dashboard</h1>
      <Suspense fallback={<Loader />}>
        <Dashboard />
      </Suspense>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Dashboard 📊',
  description: 'Contemplate ascents charts and statistics',
  keywords: ['climbing', 'statistics', 'charts', 'dashboard', 'filter'],
}
