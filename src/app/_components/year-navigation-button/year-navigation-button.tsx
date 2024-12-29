import { Link } from 'next-view-transitions'
import styles from './year-navigation-button.module.css'

export async function YearNavigationButton({
  currentYear,
  nextOrPrevious,
  enabled,
}: {
  currentYear: number
  nextOrPrevious: 'next' | 'previous'
  enabled: boolean
}) {
  if (!enabled) return <span />
  const targetYear =
    nextOrPrevious === 'next' ? currentYear + 1 : currentYear - 1
  return (
    <Link
      className={`btn ${styles.button}`}
      href={`./${targetYear}`}
      title={targetYear?.toString() ?? ''}
    >
      {nextOrPrevious === 'next' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-arrow-right-circle"
        >
          <title>Arrow Right Circle</title>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 16 16 12 12 8" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-arrow-left-circle"
        >
          <title>Arrow Left Circle</title>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 8 8 12 12 16" />
          <line x1="16" y1="12" x2="8" y2="12" />
        </svg>
      )}
    </Link>
  )
}
