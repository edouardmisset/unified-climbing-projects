import { type ReactNode, Suspense } from 'react'
import { Loader } from '../loader/loader'
import { Header } from './header'

export default function Layout({
  gridClassName = '',
  layout = 'grid',
  children,
  title,
}: GridLayoutProps) {
  return (
    <section className='flexColumn w100 h100 overflowXClip'>
      <Header title={title} />
      <Suspense fallback={<Loader />}>
        <div className={`${layout} ${gridClassName}`}>{children}</div>
      </Suspense>
    </section>
  )
}

type GridLayoutProps = {
  gridClassName?: string
  children: ReactNode
  layout?: 'grid' | 'flexColumn' | 'flexRow'
  title: ReactNode
}
