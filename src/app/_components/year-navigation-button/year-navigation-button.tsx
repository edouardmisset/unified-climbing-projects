import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react'
import { Link } from 'next-view-transitions'
import styles from './year-navigation-button.module.css'

export function YearNavigationButton({
  selectedYear,
  nextOrPrevious,
  enabled,
  path = '',
}: {
  selectedYear: number
  nextOrPrevious: 'next' | 'previous'
  enabled: boolean
  path?: string
}) {
  if (!(enabled && isValidNumber(selectedYear))) return <span />

  const isNextYear = nextOrPrevious === 'next'
  const targetYear = isNextYear ? selectedYear + 1 : selectedYear - 1
  const title = `${isNextYear ? 'Next' : 'Previous'} year: ${targetYear}`
  const icon = isNextYear ? <ArrowRightCircleIcon /> : <ArrowLeftCircleIcon />
  const targetYearPath = `.${path}/${targetYear}`

  return (
    <Link
      className={`${styles.button} ${isNextYear ? styles.right : styles.left}`}
      href={targetYearPath}
      prefetch
      title={title}
    >
      {icon}
    </Link>
  )
}
