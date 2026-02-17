import { memo } from 'react'
import { fromClimbingDisciplineToEmoji } from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'
import { DisplayGrade } from '../climbing/display-grade/display-grade'
import styles from './ascents-popover-description.module.css'

const AscentPopoverItem = memo(
  ({
    climbingDiscipline,
    crag,
    routeName,
    showCrag,
    topoGrade,
  }: {
    climbingDiscipline: Ascent['climbingDiscipline']
    crag: Ascent['crag']
    routeName: Ascent['routeName']
    showCrag: boolean
    topoGrade: Ascent['topoGrade']
  }) => {
    const cragDescription = showCrag ? `- ${crag}` : ''
    return (
      <li className={styles.item}>
        {fromClimbingDisciplineToEmoji(climbingDiscipline)} {routeName} (
        <DisplayGrade climbingDiscipline={climbingDiscipline} grade={topoGrade} />){' '}
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
      {ascents.map(({ _id, routeName, topoGrade, climbingDiscipline, crag }) => (
        <AscentPopoverItem
          climbingDiscipline={climbingDiscipline}
          crag={crag}
          key={_id}
          routeName={routeName}
          showCrag={showCrag}
          topoGrade={topoGrade}
        />
      ))}
    </ul>
  )
}
