import { Toggle } from '@base-ui-components/react/toggle'
import { ToggleGroup } from '@base-ui-components/react/toggle-group'
import type { CSSProperties } from 'react'
import { disjunctiveListFormatter } from '~/helpers/list-formatter'
import { ASCENT_STYLE } from '~/schema/ascent'
import { ClimbingStyle } from '../climbing/climbing-style/climbing-style'
import styles from './climbing-style-toggle-group.module.css'

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
        disabled={isOnsightDisable}
        hidden={isOnsightDisable}
        style={isOnsightDisable ? disabledStyle : undefined}
        title={
          isOnsightDisable
            ? 'Historically, boulders can only be flashed, not onsighted'
            : 'Onsight: the route was climbed first try with no prior information (not used for boulders)'
        }
        value="Onsight"
      >
        <ClimbingStyle climbingStyle="Onsight" />
      </Toggle>
      <Toggle
        aria-label="Flash"
        className={`contrast-color ${styles.Button}`}
        title="Flash: the route was climbed first try using any prior information (also used for boulders)"
        value="Flash"
      >
        <ClimbingStyle climbingStyle="Flash" />
      </Toggle>
    </ToggleGroup>
  )
}

const disabledStyle: CSSProperties = {
  color: 'var(--gray-7)',
  cursor: 'not-allowed',
}

type ClimbingStyleToggleGroupProps = {
  display: boolean
  onValueChange: (groupValue: string[], event: Event) => void
  value?: string
  isOnsightDisable: boolean
}
