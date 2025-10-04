import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { memo, type ReactNode, Suspense } from 'react'
import { Loader } from '../loader/loader'
import { ALL_TIME } from '../wrap-up/constants'
import { YearNavigationButton } from '../year-navigation-button/year-navigation-button'
import { YEAR_OF_FIRST_ASCENT } from './constants'
import styles from './page-layout.module.css'

export default function Layout({
  gridClassName = '',
  layout = 'grid',
  children,
  title,
  banner,
}: GridLayoutProps) {
  const titleIsValidNumber = isValidNumber(title)

  const beforeTitle = titleIsValidNumber ? (
    <YearNavigationButton
      enabled={YEAR_OF_FIRST_ASCENT < title}
      nextOrPrevious="previous"
      selectedYear={title}
    />
  ) : title === ALL_TIME ? (
    <YearNavigationButton
      enabled
      nextOrPrevious="previous"
      path="/wrap-up"
      selectedYear={new Date().getFullYear() + 1}
    />
  ) : undefined

  const afterTitle = titleIsValidNumber && (
    <YearNavigationButton
      enabled={title < new Date().getFullYear()}
      nextOrPrevious="next"
      selectedYear={title}
    />
  )

  return (
    <section className="flexColumn w100 h100 overflowXClip">
      <Header afterTitle={afterTitle} beforeTitle={beforeTitle} title={title} />
      {banner}
      <Suspense fallback={<Loader />}>
        <div className={`${layout} ${gridClassName}`}>{children}</div>
      </Suspense>
    </section>
  )
}

const Header = memo(
  ({
    afterTitle,
    beforeTitle,
    title,
  }: {
    afterTitle: ReactNode
    beforeTitle: ReactNode
    title: ReactNode
  }) => (
    <div className={`${styles.header} ${styles.patagonia}`}>
      {beforeTitle}
      <h1 className="centerText w100">{title}</h1>
      {afterTitle}
    </div>
  ),
)

type GridLayoutProps = {
  gridClassName?: string
  children: ReactNode
  layout?: 'grid' | 'flexColumn' | 'flexRow'
  title: ReactNode
  /**
   * Optional content to display between the header and the grid
   */
  banner?: ReactNode
}
