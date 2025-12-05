import { formatGrade } from '~/helpers/format-grade'
import type { Ascent } from '~/schema/ascent'
import { AscentCard } from '../ascent-card/ascent-card'
import { Dialog } from '../dialog/dialog'
import styles from './ascent-component.module.css'

export function AscentComponent({ ascent }: { ascent: Ascent }) {
  const { topoGrade, climbingDiscipline, routeName } = ascent
  const formattedRouteName = `${routeName} (${formatGrade({ climbingDiscipline, grade: topoGrade })})`
  return (
    <Dialog
      content={<AscentCard ascent={ascent} />}
      triggerClassName={styles.trigger}
      triggerText={formattedRouteName}
    />
  )
}
