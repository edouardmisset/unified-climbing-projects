import { NON_BREAKING_SPACE } from '~/constants/generic'
import { formatShortDate, fromClimbingDisciplineToEmoji } from '~/helpers/formatters'
import type { TrainingSession } from '~/schema/training'

export function SessionList({ sessions }: { sessions: TrainingSession[] }) {
  return (
    <ul className='scrollList'>
      {sessions.map(({ _id, discipline, date, location }) => {
        const disciplineIcon = discipline ? fromClimbingDisciplineToEmoji(discipline) : '―'

        return (
          <li className='scrollListItem' key={_id}>
            {disciplineIcon}
            {NON_BREAKING_SPACE}
            <span className='monospace'>{formatShortDate(date)}</span>
            {location === undefined || location === '' ? undefined : ` - ${location}`}
          </li>
        )
      })}
    </ul>
  )
}
