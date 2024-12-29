import { isValidNumber } from '@edouardmisset/math'
import type { ReactNode } from 'react'
import { YearNavigationButton } from '../year-navigation-button/year-navigation-button'

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
        {titleIsValidNumber && (
          <YearNavigationButton
            currentYear={titleIsValidNumber ? title : Number.NaN}
            nextOrPrevious="previous"
            enabled={titleIsValidNumber}
          />
        )}
        <h1 className="center-text">{title}</h1>
        {titleIsValidNumber && (
          <YearNavigationButton
            currentYear={titleIsValidNumber ? title : Number.NaN}
            nextOrPrevious="next"
            enabled={titleIsValidNumber}
          />
        )}
      </div>
      <div className="grid">{children}</div>
    </section>
  )
}
