import type { Metadata } from 'next'
import { Suspense } from 'react'
import { FilteredAscentTable } from '../_components/filtered-ascents-table/filtered-ascents-table'
import { Loader } from '../_components/loader/loader'
import styles from './page.module.css'

export default async function Page() {
  return (
    <div className={styles.container}>
      <h1 className="super-center">Ascents</h1>
      <Suspense fallback={<Loader />}>
        <FilteredAscentTable />
      </Suspense>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Table 📇',
  description: 'View all climbing ascents',
  keywords: ['climbing', 'ascents', 'list'],
}
