import type { Ascent } from '~/schema/ascent'
import { AscentCard } from '../ascent-card/ascent-card'
import AscentDialog from './_components/ascent-dialog'
import styles from './ascent-component.module.css'

export function AscentComponent({
  ascent,
  showGrade = false,
}: { ascent: Ascent; showGrade?: boolean }) {
  return (
    <AscentDialog
      triggerText={`${ascent.routeName} ${showGrade ? `(${ascent.topoGrade})` : ''}`}
      triggerClassName={styles.trigger}
      content={<AscentCard ascent={ascent} />}
    />
  )
}
