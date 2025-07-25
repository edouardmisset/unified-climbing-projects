import { Switch } from '@base-ui-components/react/switch'
import styles from './light-dark-switch.module.css'

export function LightDarkSwitch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}): React.JSX.Element {
  return (
    <Switch.Root
      checked={checked}
      className={styles.Switch}
      onCheckedChange={onChange}
    >
      <Switch.Thumb className={styles.Thumb} />
    </Switch.Root>
  )
}
