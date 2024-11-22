import Link from 'next/link'

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
      className="btn"
      style={{
        background:
          'radial-gradient(circle, var(--surface-2) 25%, transparent 50%)',
        border: 'none',
        borderRadius: '100vw',
        boxShadow: 'none',
        inlineSize: 'var(--size-9)',
        blockSize: 'var(--size-9)',
        marginBlock: 'auto',
      }}
      href={`./${targetYear}`}
      title={targetYear?.toString() ?? ''}
    >
      {nextOrPrevious === 'next' ? '>' : '<'}
    </Link>
  )
}
