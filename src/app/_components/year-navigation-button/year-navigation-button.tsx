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

  const targetYear =
    nextOrPrevious === 'next' ? selectedYear + 1 : selectedYear - 1
  return (
    <Link
      className={`${styles.button} ${nextOrPrevious === 'next' ? styles.right : styles.left}`}
      href={`.${path}/${targetYear}`}
      prefetch
      title={
        nextOrPrevious === 'next'
          ? `Next year: ${targetYear}`
          : `Previous year: ${targetYear}`
      }
    >
      {nextOrPrevious === 'next' ? (
        <ArrowRightCircleIcon />
      ) : (
        <ArrowLeftCircleIcon />
      )}
    </Link>
  )
}
