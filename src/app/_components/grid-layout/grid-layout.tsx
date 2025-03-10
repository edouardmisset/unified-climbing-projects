import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { type ReactNode, Suspense } from 'react'
import { YearNavigationButton } from '../year-navigation-button/year-navigation-button'

import { Loader } from '../loader/loader'
import { ALL_TIME } from '../wrap-up/constants'
import { YEAR_OF_FIRST_ASCENT } from './constants'
import styles from './grid-layout.module.css'

export default function GridLayout({
  children,
  title,
  additionalContent,
}: {
  children: ReactNode
  title: ReactNode
  additionalContent?: ReactNode
}) {
  const titleIsValidNumber = isValidNumber(title)

  const beforeTitle = titleIsValidNumber ? (
    <YearNavigationButton
      selectedYear={title}
      nextOrPrevious="previous"
      enabled={YEAR_OF_FIRST_ASCENT < title}
    />
  ) : title === ALL_TIME ? (
    <YearNavigationButton
      selectedYear={new Date().getFullYear() + 1}
      nextOrPrevious="previous"
      enabled={true}
      path="/wrap-up"
    />
  ) : null

  const afterTitle = titleIsValidNumber && (
    <YearNavigationButton
      selectedYear={title}
      nextOrPrevious="next"
      enabled={title < new Date().getFullYear()}
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
        <div className="grid">{children}</div>
      </Suspense>
    </section>
  )
}
