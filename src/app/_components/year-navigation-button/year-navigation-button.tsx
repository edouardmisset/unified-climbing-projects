import { isValidNumber } from '@edouardmisset/math'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react'
import Link from 'next/link'
import styles from './year-navigation-button.module.css'

// The repeated direction checks keep link semantics and presentation visibly aligned.
// fallow-ignore-next-line complexity
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

  const targetYear = nextOrPrevious === 'next' ? selectedYear + 1 : selectedYear - 1
  return (
    <Link
      className={`${styles.button} ${nextOrPrevious === 'next' ? styles.right : styles.left}`}
      href={`.${path}/${targetYear}`}
      prefetch
      title={
        nextOrPrevious === 'next' ? `Next year: ${targetYear}` : `Previous year: ${targetYear}`
      }
    >
      {nextOrPrevious === 'next' ? <ArrowRightCircleIcon /> : <ArrowLeftCircleIcon />}
    </Link>
  )
}
