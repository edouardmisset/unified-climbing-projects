import type { Ascent } from '~/schema/ascent'
import { AscentPopoverItem } from './ascent-popover-item'
import styles from './ascents-popover-description.module.css'

export function AscentsPopoverDescription({
  ascents,
  showCrag = false,
}: {
  ascents?: Ascent[]
  showCrag?: boolean
}) {
  if (ascents === undefined || ascents[0] === undefined) return ''

  return (
    <ul className={styles.list}>
      {ascents.map(({ _id, name, grade, discipline, crag }) => (
        <AscentPopoverItem
          discipline={discipline}
          crag={crag}
          key={_id}
          name={name}
          showCrag={showCrag}
          grade={grade}
        />
      ))}
    </ul>
  )
}
