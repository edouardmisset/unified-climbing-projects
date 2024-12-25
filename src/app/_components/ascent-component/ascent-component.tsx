import type { Ascent } from '~/schema/ascent'

import { Link } from 'next-view-transitions'
import { createAscentTooltip } from '~/helpers/tooltips.ts'
import styles from './ascent-component.module.css'

export function AscentComponent({
  ascent,
  showGrade = false,
}: { ascent: Ascent; showGrade?: boolean }) {
  const tooltip = createAscentTooltip(ascent)
  return (
    <Link
      title={tooltip}
      className={styles.container}
      href={`/ascents/${ascent.id}`}
    >
      {ascent.routeName} {showGrade ? `(${ascent.topoGrade})` : ''}
    </Link>
  )
}
