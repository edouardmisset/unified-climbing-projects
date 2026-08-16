import { isValidNumber } from '@edouardmisset/math'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react'
import Link from 'next/link'
import styles from './year-navigation-button.module.css'

const DIRECTION = {
  next: { Icon: ArrowRightCircleIcon, label: 'Next', offset: 1, style: styles.right },
  previous: { Icon: ArrowLeftCircleIcon, label: 'Previous', offset: -1, style: styles.left },
} as const

export function YearNavigationButton({
  basePath,
  selectedYear,
  nextOrPrevious,
  enabled,
}: {
  basePath: string
  selectedYear: number
  nextOrPrevious: 'next' | 'previous'
  enabled: boolean
}) {
  if (!(enabled && isValidNumber(selectedYear))) return <span />

  const { Icon, label, offset, style } = DIRECTION[nextOrPrevious]
  const targetYear = selectedYear + offset
  return (
    <Link
      className={`${styles.button} ${style}`}
      href={`${basePath}/${targetYear}`}
      prefetch
      title={`${label} year: ${targetYear}`}
    >
      <Icon />
    </Link>
  )
}
