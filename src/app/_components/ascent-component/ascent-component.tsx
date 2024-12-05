import type { Ascent } from '~/schema/ascent'

import { createAscentTooltip } from '~/helpers/tooltips.ts'
import styles from './ascent-component.module.css'

export function AscentComponent({
  ascent,
  showGrade = false,
}: { ascent: Ascent; showGrade?: boolean }) {
  const tooltip = createAscentTooltip(ascent)

  // TODO: this should be a link sending to the ascent page (/ascents/:id) ?
  return (
    <span title={tooltip} className={styles.span}>
      {ascent.routeName} {showGrade ? `(${ascent.topoGrade})` : ''}
    </span>
  )
}
