import { Toggle } from '@base-ui-components/react/toggle'
import { ToggleGroup } from '@base-ui-components/react/toggle-group'
import { disjunctiveListFormatter } from '~/helpers/list-formatter'
import { ASCENT_STYLE } from '~/schema/ascent'
import styles from './climbing-style-toggle-group.module.css'

type ClimbingStyleToggleGroupProps = {
  display: boolean
  onValueChange: (groupValue: string[], event: Event) => void
  value?: string
  isOnsightDisable: boolean
}

export function ClimbingStyleToggleGroup(
  props: Omit<ToggleGroup.Props, 'value'> & ClimbingStyleToggleGroupProps,
) {
  const { display, onValueChange, value, isOnsightDisable, ...rest } = props

  if (!display) return undefined

  return (
    <ToggleGroup
      {...rest}
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
        style={
          isOnsightDisable
            ? {
                color: 'var(--gray-7)',
                cursor: 'not-allowed',
              }
            : undefined
        }
        title={
          isOnsightDisable
            ? 'Historically, boulders can only be flashed, not onsighted'
            : 'Onsight: the route was climbed first try with no prior information (not used for boulders)'
        }
        value="Onsight"
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
