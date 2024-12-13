import { Item, Root } from '@radix-ui/react-toggle-group'
import styles from './toggle-group.module.css'

type ClimbingStyleToggleGroup = {
  display: boolean
  onValueChange: (value: string) => void
  value?: string
}

export function ClimbingStyleToggleGroup(props: ClimbingStyleToggleGroup) {
  const { display, onValueChange, value } = props

  if (!display) return null
  return (
    <Root
      className={styles.Group}
      type="single"
      defaultValue="Redpoint"
      value={value}
      aria-label="climbing style"
      onValueChange={onValueChange}
    >
      <Item className={styles.Item} value="Onsight" aria-label="Left aligned">
        Onsight
      </Item>
      <Item className={styles.Item} value="Flash" aria-label="Right aligned">
        Flash
      </Item>
    </Root>
  )
}
