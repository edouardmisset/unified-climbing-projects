import { capitalize } from '@edouardmisset/text/capitalize.ts'
import { memo } from 'react'
import styles from './tries-by-grades.module.css'

interface PayloadEntry {
  dataKey: string | number
  value: number
}

interface CustomTooltipProps {
  active?: boolean
  label?: string | number
  payload?: readonly PayloadEntry[]
}

function TriesByGradeTooltipComponent({ active, label, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className={styles.tooltip}>
      <strong>{label}</strong>
      {payload.map((entry: PayloadEntry) => (
        <div key={String(entry.dataKey)}>
          {capitalize(String(entry.dataKey))} # of tries: <strong>{entry.value}</strong>
        </div>
      ))}
    </div>
  )
}

export const TriesByGradeTooltip = memo(TriesByGradeTooltipComponent)
