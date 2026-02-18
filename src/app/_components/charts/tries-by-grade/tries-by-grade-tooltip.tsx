import { capitalize } from '@edouardmisset/text/capitalize.ts'
import type { PointTooltipProps } from '@nivo/line'
import { memo } from 'react'
import styles from './tries-by-grades.module.css'

function TriesByGradeTooltipComponent(props: PointTooltipProps) {
  const { point } = props

  return (
    <div className={styles.tooltip}>
      <strong>{point.data.xFormatted}</strong> {capitalize(point.serieId.toString())} # of tries:{' '}
      <strong>{point.data.yFormatted}</strong>
    </div>
  )
}

export const TriesByGradeTooltip = memo(TriesByGradeTooltipComponent)
