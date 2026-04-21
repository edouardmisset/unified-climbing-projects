import { memo } from 'react'
import { fromClimbingDisciplineToEmoji } from '~/shared/helpers/formatters'
import type { Ascent } from '~/ascents/schema'
import { DisplayGrade } from '~/shared/components/climbing/display-grade/display-grade'
import styles from './ascents-popover-description.module.css'

type AscentPopoverItemProps = {
  climbingDiscipline: Ascent['climbingDiscipline']
  crag: Ascent['crag']
  routeName: Ascent['routeName']
  showCrag: boolean
  topoGrade: Ascent['topoGrade']
}

function AscentPopoverItemComponent(props: AscentPopoverItemProps) {
  const { climbingDiscipline, crag, routeName, showCrag, topoGrade } = props
  const cragDescription = showCrag ? `- ${crag}` : ''
  return (
    <li className={styles.item}>
      {fromClimbingDisciplineToEmoji(climbingDiscipline)} {routeName} (
      <DisplayGrade climbingDiscipline={climbingDiscipline} grade={topoGrade} />) {cragDescription}
    </li>
  )
}

export const AscentPopoverItem = memo(AscentPopoverItemComponent)
