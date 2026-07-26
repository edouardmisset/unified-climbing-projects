import { memo } from 'react'
import { fromClimbingDisciplineToEmoji } from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'
import { DisplayGrade } from '../climbing/display-grade/display-grade'
import styles from './ascents-popover-description.module.css'

type AscentPopoverItemProps = {
  discipline: Ascent['discipline']
  crag: Ascent['crag']
  name: Ascent['name']
  showCrag: boolean
  grade: Ascent['grade']
}

function AscentPopoverItemComponent(props: AscentPopoverItemProps) {
  const { discipline, crag, name, showCrag, grade } = props
  const cragDescription = showCrag ? `- ${crag}` : ''
  return (
    <li className={styles.item}>
      {fromClimbingDisciplineToEmoji(discipline)} {name} (
      <DisplayGrade discipline={discipline} grade={grade} />) {cragDescription}
    </li>
  )
}

export const AscentPopoverItem = memo(AscentPopoverItemComponent)
