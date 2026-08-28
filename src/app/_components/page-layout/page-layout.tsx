import { type ReactNode, Suspense } from 'react'
import { Loader } from '../ui/loader/loader'
import { Header } from './header'
import styles from './page-layout.module.css'

export default function Layout({
  fullScreenOnPhoneLandscape = false,
  gridClassName = '',
  layout = 'grid',
  children,
  title,
}: GridLayoutProps) {
  return (
    <section
      className={`flexColumn w100 h100 overflowXClip ${fullScreenOnPhoneLandscape ? styles.fullScreenOnPhoneLandscape : ''}`}
      data-fullscreen-on-phone-landscape={fullScreenOnPhoneLandscape ? 'true' : undefined}
    >
      <Header title={title} />
      <div className={styles.contentArea}>
        <div className={styles.scrollArea}>
          <Suspense
            fallback={
              <div className={styles.loadingArea}>
                <Loader />
              </div>
            }
          >
            <div className={`${layout} ${gridClassName}`}>{children}</div>
          </Suspense>
        </div>
      </div>
    </section>
  )
}

type GridLayoutProps = {
  fullScreenOnPhoneLandscape?: boolean
  gridClassName?: string
  children: ReactNode
  layout?: 'grid' | 'flexColumn' | 'flexRow'
  title: ReactNode
}
