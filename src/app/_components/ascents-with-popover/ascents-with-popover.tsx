import { capitalize } from '@edouardmisset/text'
import { useMemo } from 'react'
import { writeAscentsDisciplineText } from '~/helpers/write-ascents-discipline-text'
import type { AscentListProps } from '~/schema/ascent'
import { Popover } from '../popover/popover'
import { AscentList } from './ascent-list'
import styles from './ascents-with-popover.module.css'

export function AscentsWithPopover({ ascents }: AscentListProps) {
  const ascentsDisciplineText = useMemo(() => writeAscentsDisciplineText(ascents), [ascents])

  const title = useMemo(() => capitalize(ascentsDisciplineText), [ascentsDisciplineText])

  return (
    <Popover
      popoverDescription={<AscentList ascents={ascents} />}
      popoverTitle={title}
      triggerClassName={styles.popover}
      triggerContent={
        <strong>
          {ascents.length} {ascentsDisciplineText}
        </strong>
      }
    />
  )
}
