import type { Ascent } from '~/schema/ascent'

import { createAscentTooltip } from '~/helpers/tooltips.ts'
import styles from './ascent-component.module.css'

export function AscentComponent({ ascent }: { ascent: Ascent }) {
  const tooltip = createAscentTooltip(ascent)

  // TODO: this should be a link sending to the ascent page (/ascents/:id) ?
  return (
    <span title={tooltip} className={styles.span}>
      {ascent.routeName}
    </span>
  )
}
