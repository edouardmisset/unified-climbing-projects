import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import type { ReactNode } from 'react'
import { YearNavigationButton } from '../year-navigation-button/year-navigation-button'

import { ALL_TIME } from '../wrap-up/constants'
import { YEAR_OF_FIRST_ASCENT } from './constants'
import styles from './grid-layout.module.css'

export default async function GridLayout({
  children,
  title,
}: {
  children: ReactNode
  title: string | number
}) {
  const titleIsValidNumber = isValidNumber(title)
  return (
    <section className="flex-column w100 ">
      <div className={styles.header}>
        {titleIsValidNumber ? (
          <YearNavigationButton
            currentYear={titleIsValidNumber ? title : Number.NaN}
            nextOrPrevious="previous"
            enabled={titleIsValidNumber && YEAR_OF_FIRST_ASCENT < title}
          />
        ) : title === ALL_TIME ? (
          <YearNavigationButton
            currentYear={new Date().getFullYear() + 1}
            nextOrPrevious="previous"
            enabled={true}
            path="/wrap-up"
          />
        ) : null}
        <h1 className="center-text w100">{title}</h1>
        {titleIsValidNumber && (
          <YearNavigationButton
            currentYear={titleIsValidNumber ? title : Number.NaN}
            nextOrPrevious="next"
            enabled={titleIsValidNumber && title < new Date().getFullYear()}
          />
        )}
      </div>
      <div className="grid">{children}</div>
    </section>
  )
}
