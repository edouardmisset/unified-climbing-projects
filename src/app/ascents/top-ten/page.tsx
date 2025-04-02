import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import styles from '../page.module.css'
import { TableAndSelect } from './_components/table-and-select'

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <div className={styles.container}>
      <h1 className="super-center">Top Ten Ascents</h1>
      <Suspense fallback={<Loader />}>
        <TableAndSelect />
      </Suspense>
    </div>
  )
}
