import { capitalize } from '@edouardmisset/text'
import { useMemo } from 'react'
import { formatNumber } from '~/shared/helpers/number-formatter'
import { writeAscentsDisciplineText } from '~/ascents/helpers/write-ascents-discipline-text'
import type { AscentListProps } from '~/ascents/schema'
import { Popover } from '~/shared/components/ui/popover/popover'
import { AscentList } from './ascent-list'
import styles from './ascents-with-popover.module.css'

export function AscentsWithPopover({ ascents }: AscentListProps) {
  const ascentsDisciplineText = useMemo(() => writeAscentsDisciplineText(ascents), [ascents])

  const title = useMemo(() => capitalize(ascentsDisciplineText), [ascentsDisciplineText])

  return (
    <Popover
      className={styles.popover}
      popoverTitle={title}
      trigger={
        <strong>
          {formatNumber(ascents.length)} {ascentsDisciplineText}
        </strong>
      }
    >
      <AscentList ascents={ascents} />
    </Popover>
  )
}
