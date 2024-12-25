import { Suspense } from 'react'
import { Dashboard } from '~/app/_components/dashboard/dashboard'
import styles from './page.module.css'

export default function Page() {
  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </div>
  )
}
