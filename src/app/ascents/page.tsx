import type { Metadata } from 'next'
import { Suspense } from 'react'
import { FilteredAscentTable } from '../_components/filtered-ascents-table/filtered-ascents-table'
import { Loader } from '../_components/loader/loader'
import styles from './page.module.css'
import { api } from '~/trpc/server'

export default async function Page() {
  const ascents = await api.ascents.getAllAscents()
  return (
    <div className={styles.container}>
      <h1 className="super-center">Ascents</h1>
      <Suspense fallback={<Loader />}>
        <FilteredAscentTable ascents={ascents} />
      </Suspense>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Table 📇',
  description: 'View all climbing ascents',
  keywords: ['climbing', 'ascents', 'list'],
}
