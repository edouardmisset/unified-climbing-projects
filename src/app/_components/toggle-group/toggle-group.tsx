import { Item, Root } from '@radix-ui/react-toggle-group'
import { disjunctiveListFormatter } from '~/helpers/list'
import { ASCENT_STYLE } from '~/schema/ascent'
import styles from './toggle-group.module.css'

type ClimbingStyleToggleGroup = {
  display: boolean
  onValueChange: (value: string) => void
  value?: string
  isOnsightDisable: boolean
}

export function ClimbingStyleToggleGroup(props: ClimbingStyleToggleGroup) {
  const { display, onValueChange, value, isOnsightDisable } = props

  if (!display) return null

  return (
    <Root
      aria-label={`Climbing style (${disjunctiveListFormatter(ASCENT_STYLE)}). Default is "Redpoint" if number of tries is greater than 1.`}
      className={styles.Group}
      defaultValue="Redpoint"
      onValueChange={onValueChange}
      type="single"
      value={isOnsightDisable ? 'Flash' : value}
    >
      <Item
        aria-hidden={isOnsightDisable}
        aria-label="Onsight"
        className={styles.Item}
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
      </Item>
      <Item
        aria-label="Flash"
        className={styles.Item}
        title="Flash: the route was climbed first try using any prior information (also used for boulders)"
        value="Flash"
      >
        Flash
      </Item>
    </Root>
  )
}
