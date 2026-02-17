import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { YearNavigationButton } from '../../year-navigation-button/year-navigation-button'
import { ALL_TIME, YEAR_OF_FIRST_ASCENT } from '../constants'

export function WrapUpHeader({ year }: { year?: number }) {
  const title = year ?? ALL_TIME
  const titleIsValidNumber = isValidNumber(title)

  const beforeTitle = titleIsValidNumber ? (
    <YearNavigationButton
      enabled={YEAR_OF_FIRST_ASCENT < title}
      nextOrPrevious='previous'
      selectedYear={title}
    />
  ) : title === ALL_TIME ? (
    <YearNavigationButton
      enabled
      nextOrPrevious='previous'
      path='/wrap-up'
      selectedYear={new Date().getFullYear() + 1}
    />
  ) : undefined

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
