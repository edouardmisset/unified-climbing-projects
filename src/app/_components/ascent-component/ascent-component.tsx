import { displayGrade } from '~/helpers/display-grade'
import type { Ascent } from '~/schema/ascent'
import { AscentCard } from '../ascent-card/ascent-card'
import AscentDialog from './_components/ascent-dialog'
import styles from './ascent-component.module.css'

export function AscentComponent({
  ascent,
  showGrade = false,
}: {
  ascent: Ascent
  showGrade?: boolean
}) {
  const { topoGrade, climbingDiscipline, routeName } = ascent
  return (
    <AscentDialog
      content={<AscentCard ascent={ascent} />}
      triggerClassName={styles.trigger}
      triggerText={`${routeName} ${showGrade ? `(${displayGrade({ climbingDiscipline, grade: topoGrade })})` : ''}`}
    />
  )
}
