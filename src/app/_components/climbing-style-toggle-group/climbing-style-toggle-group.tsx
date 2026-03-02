'use client'
import { Toggle } from '@base-ui/react/toggle'
import { ToggleGroup } from '@base-ui/react/toggle-group'
import { disjunctiveListFormatter } from '~/helpers/list-formatter'
import { ASCENT_STYLE } from '~/schema/ascent'
import { ClimbingStyle } from '../climbing/climbing-style/climbing-style'
import styles from './climbing-style-toggle-group.module.css'

export function ClimbingStyleToggleGroup(
  props: Omit<ToggleGroup.Props, 'value'> & ClimbingStyleToggleGroupProps,
) {
  const { display, onValueChange, value, isOnsightDisable, ...rest } = props
  const stylesByType = [
    {
      value: 'Onsight' as const,
      disabled: isOnsightDisable,
      title: isOnsightDisable
        ? 'Historically, boulders can only be flashed, not onsighted'
        : 'Onsight: the route was climbed first try with no prior information (not used for boulders)',
    },
    {
      value: 'Flash' as const,
      disabled: false,
      title:
        'Flash: the route was climbed first try using any prior information (also used for boulders)',
    },
  ]

  if (!display) return

  return (
    <ToggleGroup
      {...rest}
      aria-label={`Climbing style (${disjunctiveListFormatter(ASCENT_STYLE)}). Default is "Redpoint" if number of tries is greater than 1.`}
      className={styles.panel}
      defaultValue={['Redpoint']}
      onValueChange={onValueChange}
      value={isOnsightDisable || !value ? ['Flash'] : [value]}
    >
      {stylesByType.map(({ value: climbingStyle, disabled, title }) => (
        <Toggle
          aria-hidden={disabled}
          aria-label={climbingStyle}
          className={`contrastColor ${styles.button}${disabled ? ' notAllowed' : ''}`}
          disabled={disabled}
          hidden={disabled}
          key={climbingStyle}
          title={title}
          value={climbingStyle}
        >
          <ClimbingStyle climbingStyle={climbingStyle} />
        </Toggle>
      ))}
    </ToggleGroup>
  )
}

type ClimbingStyleToggleGroupProps = {
  display: boolean
  onValueChange: (groupValue: string[], event: Event) => void
  value?: string
  isOnsightDisable: boolean
}
