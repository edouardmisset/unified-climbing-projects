import { capitalize } from '@edouardmisset/text/capitalize.ts'
import { addParenthesis } from '~/helpers/add-parenthesis'
import { writeAscentsDisciplineText } from '~/helpers/write-ascents-discipline-text'
import type { Ascent } from '~/schema/ascent'
import { Popover } from '../popover/popover'
import styles from './ascents-with-popover.module.css'

export function AscentsWithPopover({
  ascents,
}: { ascents: Ascent[] }): React.JSX.Element {
  const ascentsDisciplineText = writeAscentsDisciplineText(ascents)
  return (
    <Popover
      popoverDescription={
        <div className={styles.popoverContainer}>
          {ascents.map(({ id, routeName, topoGrade }) => (
            <span key={id}>{`${routeName} ${addParenthesis(topoGrade)}`}</span>
          ))}
        </div>
      }
      popoverTitle={capitalize(ascentsDisciplineText)}
      triggerContent={
        <span>
          <strong>{ascents.length}</strong> {ascentsDisciplineText}
        </span>
      }
      triggerClassName={styles.popover}
    />
  )
}
