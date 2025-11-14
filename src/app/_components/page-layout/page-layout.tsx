import { memo, type ReactNode, Suspense } from 'react'
import { Loader } from '../loader/loader'
import styles from './page-layout.module.css'

export default function Layout({
  gridClassName = '',
  layout = 'grid',
  children,
  title,
}: GridLayoutProps) {
  return (
    <section className="flexColumn w100 h100 overflowXClip">
      <Header title={title} />
      <Suspense fallback={<Loader />}>
        <div className={`${layout} ${gridClassName}`}>{children}</div>
      </Suspense>
    </section>
  )
}

const Header = memo(({ title }: { title: ReactNode }) => (
  <div className={`${styles.header} ${styles.patagonia}`}>
    <h1
      className={styles.h1}
      title={typeof title === 'string' ? title : undefined}
    >
      {title}
    </h1>
  </div>
))

type GridLayoutProps = {
  gridClassName?: string
  children: ReactNode
  layout?: 'grid' | 'flexColumn' | 'flexRow'
  title: ReactNode
}
