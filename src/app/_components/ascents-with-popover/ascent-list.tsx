import { memo } from 'react'
import type { AscentListProps } from '~/schema/ascent'
import { AscentListItem } from './ascent-list-item'
import styles from './ascents-with-popover.module.css'

function AscentListComponent(props: AscentListProps) {
  const { ascents } = props

  return (
    <ul className={styles.list}>
      {ascents.map(({ _id, ...ascent }) => (
        <AscentListItem {...ascent} key={_id} />
      ))}
    </ul>
  )
}

export const AscentList = memo(AscentListComponent)
