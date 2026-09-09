import type { AscentListProps } from '~/schema/ascent'
import { AscentListItem } from './ascent-list-item'

function AscentListComponent(props: AscentListProps) {
  const { ascents } = props

  return (
    <ul className='scrollList'>
      {ascents.map(({ _id, ...ascent }) => (
        <AscentListItem {...ascent} key={_id} />
      ))}
    </ul>
  )
}

export const AscentList = AscentListComponent
