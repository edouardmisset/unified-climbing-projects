import type { Ascent } from '~/schema/ascent'
import { DisplayGrade } from '../climbing/display-grade/display-grade'

type AscentListItemProps = {
  discipline: Ascent['discipline']
  name: Ascent['name']
  grade: Ascent['grade']
}

function AscentListItemComponent(props: AscentListItemProps) {
  const { discipline, name, grade } = props

  return (
    <li className='scrollListItem'>
      {name} (
      <DisplayGrade discipline={discipline} grade={grade} />)
    </li>
  )
}

export const AscentListItem = AscentListItemComponent
