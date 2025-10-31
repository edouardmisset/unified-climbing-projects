import { memo } from 'react'
import { fromClimbingDisciplineToEmoji } from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'
import { DisplayGrade } from '../climbing/display-grade/display-grade'
import styles from './ascents-popover-description.module.css'

const AscentPopoverItem = memo(
  ({
    discipline,
    crag,
    name,
    showCrag,
    grade,
  }: {
    discipline: Ascent['discipline']
    crag: Ascent['crag']
    name: Ascent['name']
    showCrag: boolean
    grade: Ascent['grade']
  }) => {
    const cragDescription = showCrag ? `- ${crag}` : ''
    return (
      <li className={styles.item}>
        {fromClimbingDisciplineToEmoji(discipline)} {name} (
        <DisplayGrade discipline={discipline} grade={grade} />){' '}
        {cragDescription}
      </li>
    )
  },
)

export function AscentsPopoverDescription({
  ascents,
  showCrag = false,
}: {
  ascents?: Ascent[]
  showCrag?: boolean
}) {
  if (ascents === undefined || ascents[0] === undefined) return ''

  return (
    <ul className={styles.list}>
      {ascents.map(({ _id, name, grade, discipline, crag }) => (
        <AscentPopoverItem
          crag={crag}
          discipline={discipline}
          grade={grade}
          key={_id}
          name={name}
          showCrag={showCrag}
        />
      ))}
    </ul>
  )
}
