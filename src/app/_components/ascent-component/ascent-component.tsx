import { formatGrade } from '~/helpers/format-grade'
import type { Ascent } from '~/schema/ascent'
import { AscentCard } from '../ascent-card/ascent-card'
import { Dialog } from '../dialog/dialog'
import styles from './ascent-component.module.css'

export function AscentComponent({ ascent }: { ascent: Ascent }) {
  const { grade, discipline, name } = ascent
  const formattedRouteName = `${name} (${formatGrade({ discipline, grade })})`
  return (
    <Dialog
      content={<AscentCard ascent={ascent} />}
      triggerClassName={styles.trigger}
      triggerText={formattedRouteName}
    />
  )
}
