import { capitalize } from '@edouardmisset/text'
import { memo, useMemo } from 'react'
import { writeAscentsDisciplineText } from '~/helpers/write-ascents-discipline-text'
import type { Ascent, AscentListProps } from '~/schema/ascent'
import { DisplayGrade } from '../climbing/display-grade/display-grade'
import { Popover } from '../popover/popover'
import styles from './ascents-with-popover.module.css'

const AscentListItem = memo(
  ({
    discipline,
    name,
    grade,
  }: Pick<Ascent, 'discipline' | 'name' | 'grade'>) => (
    <li className={styles.item}>
      {name} (
      <DisplayGrade discipline={discipline} grade={grade} />)
    </li>
  ),
)

const AscentList = memo(({ ascents }: AscentListProps) => (
  <ul className={styles.list}>
    {ascents.map(({ _id, ...ascent }) => (
      <AscentListItem key={_id} {...ascent} />
    ))}
  </ul>
))

export function AscentsWithPopover({ ascents }: AscentListProps) {
  const ascentsDisciplineText = useMemo(
    () => writeAscentsDisciplineText(ascents),
    [ascents],
  )

  const title = useMemo(
    () => capitalize(ascentsDisciplineText),
    [ascentsDisciplineText],
  )

  return (
    <Popover
      popoverDescription={<AscentList ascents={ascents} />}
      popoverTitle={title}
      triggerClassName={styles.popover}
      triggerContent={
        <strong>
          {ascents.length} {ascentsDisciplineText}
        </strong>
      }
    />
  )
}
