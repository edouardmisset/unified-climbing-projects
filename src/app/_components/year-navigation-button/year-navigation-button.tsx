import { isValidNumber } from '@edouardmisset/math'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react'
import { Link } from 'next-view-transitions'
import styles from './year-navigation-button.module.css'

export async function YearNavigationButton({
  currentYear,
  nextOrPrevious,
  enabled,
  path = '',
}: {
  currentYear: number
  nextOrPrevious: 'next' | 'previous'
  enabled: boolean
  path?: string
}) {
  if (!(enabled && isValidNumber(currentYear))) return <span />

  const targetYear =
    nextOrPrevious === 'next' ? currentYear + 1 : currentYear - 1
  return (
    <Link
      className={`btn ${styles.button}`}
      href={`.${path}/${targetYear}`}
      title={targetYear?.toString() ?? ''}
    >
      {nextOrPrevious === 'next' ? (
        <ArrowRightCircleIcon />
      ) : (
        <ArrowLeftCircleIcon />
      )}
    </Link>
  )
}
