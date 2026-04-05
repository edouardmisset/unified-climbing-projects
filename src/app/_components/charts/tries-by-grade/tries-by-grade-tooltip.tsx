import { capitalize } from '@edouardmisset/text/capitalize.ts'
import { memo } from 'react'
import type { TooltipContentProps } from 'recharts'
import styles from './tries-by-grades.module.css'

type TriesByGradeTooltipProps = TooltipContentProps
type PayloadEntry = NonNullable<TriesByGradeTooltipProps['payload']>[number]

function TriesByGradeTooltipComponent({ active, label, payload }: TriesByGradeTooltipProps) {
  if (!active || !payload?.length) return

  return (
    <div className={styles.tooltip}>
      <strong>{label}</strong>
      {payload.map((entry: PayloadEntry) => (
        <div key={String(entry.dataKey ?? entry.name ?? 'tries')}>
          {capitalize(String(entry.dataKey ?? entry.name ?? 'tries'))} # of tries:{' '}
          <strong>{entry.value}</strong>
        </div>
      ))}
    </div>
  )
}

export const TriesByGradeTooltip = memo(TriesByGradeTooltipComponent)
