import { Toggle } from '@base-ui-components/react/toggle'
import { ToggleGroup } from '@base-ui-components/react/toggle-group'
import { disjunctiveListFormatter } from '~/helpers/list'
import { ASCENT_STYLE } from '~/schema/ascent'
import styles from './toggle-group.module.css'

type ClimbingStyleToggleGroup = {
  display: boolean
  onValueChange: (groupValue: string[], event: Event) => void
  value?: string
  isOnsightDisable: boolean
}

export function ClimbingStyleToggleGroup(props: ClimbingStyleToggleGroup) {
  const { display, onValueChange, value, isOnsightDisable } = props

  if (!display) return null

  return (
    <ToggleGroup
      aria-label={`Climbing style (${disjunctiveListFormatter(ASCENT_STYLE)}). Default is "Redpoint" if number of tries is greater than 1.`}
      className={styles.Panel}
      defaultValue={['Redpoint']}
      onValueChange={onValueChange}
      value={isOnsightDisable ? ['Flash'] : [value]}
    >
      <Toggle
        aria-hidden={isOnsightDisable}
        aria-label="Onsight"
        className={`contrast-color ${styles.Button}`}
        // TODO: Remove disabled prop - https://axesslab.com/disabled-buttons-suck/
        disabled={isOnsightDisable}
        hidden={isOnsightDisable}
        value="Onsight"
        style={
          isOnsightDisable
            ? {
                cursor: 'not-allowed',
                color: 'var(--gray-7)',
              }
            : undefined
        }
        title={
          isOnsightDisable
            ? 'Historically, boulders can only be flashed, not onsighted'
            : 'Onsight: the route was climbed first try with no prior information (not used for boulders)'
        }
      >
        Onsight
      </Toggle>
      <Toggle
        aria-label="Flash"
        className={`contrast-color ${styles.Button}`}
        title="Flash: the route was climbed first try using any prior information (also used for boulders)"
        value="Flash"
      >
        Flash
      </Toggle>
    </ToggleGroup>
  )
}
