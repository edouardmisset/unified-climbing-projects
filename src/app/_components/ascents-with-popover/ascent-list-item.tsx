
import type { Ascent } from '~/schema/ascent'
import { DisplayGrade } from '../climbing/display-grade/display-grade'
import styles from './ascents-with-popover.module.css'

type AscentListItemProps = {
  discipline: Ascent['discipline']
  name: Ascent['name']
  grade: Ascent['grade']
}

function AscentListItemComponent(props: AscentListItemProps) {
  const { discipline, name, grade } = props

  return (
    <li className={styles.item}>
      {name} (
      <DisplayGrade discipline={discipline} grade={grade} />)
    </li>
  )
}

export const AscentListItem = AscentListItemComponent
