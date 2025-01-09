import { Suspense } from 'react'
import { api } from '~/trpc/server'
import { AscentTable } from '../_components/ascent-table/ascent-table'
import { Loader } from '../_components/loader/loader'
import styles from './page.module.css'

export default async function Page() {
  const allAscents = await api.ascents.getAllAscents()

  if (!allAscents) {
    return <div>No ascents found</div>
  }

  return (
    <div className={styles.container}>
      <h1 className="super-center">Ascents</h1>
      <Suspense fallback={<Loader />}>
        <AscentTable ascents={allAscents} />
      </Suspense>
    </div>
  )
}
