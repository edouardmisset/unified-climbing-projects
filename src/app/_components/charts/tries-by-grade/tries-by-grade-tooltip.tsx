import { capitalize } from '@edouardmisset/text'

import type { TooltipContentProps } from 'recharts'
import styles from './tries-by-grades.module.css'

type PayloadEntry = NonNullable<TooltipContentProps['payload']>[number]

function getPayloadName(entry: PayloadEntry): string {
  return String(entry.dataKey ?? entry.name ?? 'tries')
}

function TriesByGradeTooltipComponent({ active, label, payload }: TooltipContentProps) {
  if (!active || payload.length === 0) return

  return (
    <div className={styles.tooltip}>
      <strong>{label}</strong>
      {payload.map((entry: PayloadEntry) => (
        <div key={getPayloadName(entry)}>
          {capitalize(getPayloadName(entry))} # of tries: <strong>{entry.value}</strong>
        </div>
      ))}
    </div>
  )
}

export const TriesByGradeTooltip = TriesByGradeTooltipComponent
