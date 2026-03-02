import { capitalize } from '@edouardmisset/text'
import { useMemo } from 'react'
import { writeAscentsDisciplineText } from '~/helpers/write-ascents-discipline-text'
import type { AscentListProps } from '~/schema/ascent'
import { Popover } from '../ui/popover/popover'
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
          {ascents.length} {ascentsDisciplineText}
        </strong>
      }
    >
      <AscentList ascents={ascents} />
    </Popover>
  )
}
