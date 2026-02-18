import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { YearNavigationButton } from '../../year-navigation-button/year-navigation-button'
import { ALL_TIME, YEAR_OF_FIRST_ASCENT } from '../constants'
import type { ReactNode } from 'react'

export function WrapUpHeader({ year }: { year?: number }) {
  const title = year ?? ALL_TIME
  const titleIsValidNumber = isValidNumber(title)

  let beforeTitle: ReactNode = undefined

  if (titleIsValidNumber) {
    beforeTitle = (
      <YearNavigationButton
        enabled={YEAR_OF_FIRST_ASCENT < title}
        nextOrPrevious='previous'
        selectedYear={title}
      />
    )
  } else if (title === ALL_TIME) {
    beforeTitle = (
      <YearNavigationButton
        enabled
        nextOrPrevious='previous'
        path='/wrap-up'
        selectedYear={new Date().getFullYear() + 1}
      />
    )
  }

  const afterTitle = titleIsValidNumber && (
    <YearNavigationButton
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
