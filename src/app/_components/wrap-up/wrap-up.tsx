import { Suspense } from 'react'
import { Loader } from '../ui/loader/loader'
import Layout from '../page-layout/page-layout'
import { WrapUpHeader } from './_components/wrap-up-header'
import { WrapUpContent } from './wrap-up-content'
import styles from './wrap-up.module.css'

export default function WrapUp({
  homePath = '/wrap-up',
  year,
}: {
  homePath?: string
  year?: number
}) {
  return (
    <Layout
      gridClassName={`padding ${styles.wrapUp}`}
      title={<WrapUpHeader homePath={homePath} year={year} />}
    >
      <Suspense fallback={<Loader />}>
        <WrapUpContent year={year} />
      </Suspense>
    </Layout>
  )
}
