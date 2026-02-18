import { memo } from 'react'
import type { Ascent } from '~/schema/ascent'
import { DisplayGrade } from '../climbing/display-grade/display-grade'
import styles from './ascents-with-popover.module.css'

type AscentListItemProps = {
  climbingDiscipline: Ascent['climbingDiscipline']
  routeName: Ascent['routeName']
  topoGrade: Ascent['topoGrade']
}

function AscentListItemComponent(props: AscentListItemProps) {
  const { climbingDiscipline, routeName, topoGrade } = props

  return (
    <li className={styles.item}>
      {routeName} (
      <DisplayGrade climbingDiscipline={climbingDiscipline} grade={topoGrade} />)
    </li>
  )
}

export const AscentListItem = memo(AscentListItemComponent)
