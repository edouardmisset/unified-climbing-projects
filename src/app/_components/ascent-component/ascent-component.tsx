import { formatGrade } from '~/helpers/format-grade'
import type { Ascent } from '~/schema/ascent'
import { AscentCard } from '../ascent-card/ascent-card'
import { Dialog } from '../dialog/dialog'
import styles from './ascent-component.module.css'

export function AscentComponent({
  ascent,
  showGrade = false,
}: {
  ascent: Ascent
  showGrade?: boolean
}) {
  const { grade, discipline, name } = ascent
  return (
    <Dialog
      content={<AscentCard ascent={ascent} />}
      triggerClassName={styles.trigger}
      triggerText={
        showGrade ? `${name} (${formatGrade({ discipline, grade })})` : name
      }
    />
  )
}
