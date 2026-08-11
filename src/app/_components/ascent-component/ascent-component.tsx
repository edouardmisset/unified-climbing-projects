import { formatGrade } from '~/helpers/format-grade'
import { getAscentById } from '~/services/ascents'
import type { Ascent } from '~/schema/ascent'
import { AscentCard } from '../ascent-card/ascent-card'
import { Dialog } from '../ui/dialog/dialog'
import styles from './ascent-component.module.css'

export async function AscentComponent({ ascent }: { ascent: Ascent }) {
  const { grade, discipline, name, _id } = ascent
  const formattedRouteName = `${name} (${formatGrade({ discipline, grade })})`
  const ascentWithComments = await getAscentById(_id)

  if (!ascentWithComments) return null

  return (
    <Dialog
      content={<AscentCard ascent={ascentWithComments} />}
      triggerClassName={styles.trigger}
      triggerText={formattedRouteName}
    />
  )
}
