import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { type ReactNode, Suspense } from 'react'
import { Loader } from '../loader/loader'
import { ALL_TIME } from '../wrap-up/constants'
import { YearNavigationButton } from '../year-navigation-button/year-navigation-button'
import { YEAR_OF_FIRST_ASCENT } from './constants'
import styles from './grid-layout.module.css'

export default function GridLayout({
  gridClassName = '',
  children,
  title,
  additionalContent,
}: {
  gridClassName?: string
  children: ReactNode
  title: ReactNode
  additionalContent?: ReactNode
}) {
  const titleIsValidNumber = isValidNumber(title)

  const beforeTitle = titleIsValidNumber ? (
    <YearNavigationButton
      enabled={YEAR_OF_FIRST_ASCENT < title}
      nextOrPrevious="previous"
      selectedYear={title}
    />
  ) : title === ALL_TIME ? (
    <YearNavigationButton
      enabled={true}
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
    <section className="flex-column gap w100 h100">
      <div className={`${styles.header} ${styles.patagonia}`}>
        {beforeTitle}
        <h1 className="center-text w100">{title}</h1>
        {afterTitle}
      </div>
      {additionalContent}
      <Suspense fallback={<Loader />}>
        <div className={`grid ${gridClassName}`}>{children}</div>
      </Suspense>
    </section>
  )
}
