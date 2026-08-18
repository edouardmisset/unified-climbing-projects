'use client'

import { isValidNumber } from '@edouardmisset/math'
import { YearNavigationButton } from '../../year-navigation-button/year-navigation-button'
import { ALL_TIME, YEAR_OF_FIRST_ASCENT } from '../constants'

export function WrapUpHeader({ homePath, year }: { homePath: string; year?: number }) {
  const title = year ?? ALL_TIME
  const titleIsValidNumber = isValidNumber(title)

  const beforeTitle = titleIsValidNumber ? (
    <YearNavigationButton
      basePath={homePath}
      enabled={YEAR_OF_FIRST_ASCENT < title}
      nextOrPrevious='previous'
      selectedYear={title}
    />
  ) : (
    <YearNavigationButton
      basePath={homePath}
      enabled
      nextOrPrevious='previous'
      selectedYear={new Date().getFullYear() + 1}
    />
  )

  const afterTitle = titleIsValidNumber && (
    <YearNavigationButton
      basePath={homePath}
      enabled={title < new Date().getFullYear()}
      nextOrPrevious='next'
      selectedYear={title}
    />
  )

  return (
    <>
      {beforeTitle}
      {title}
      {afterTitle}
    </>
  )
}
