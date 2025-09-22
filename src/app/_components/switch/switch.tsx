import { Switch as BaseSwitch } from '@base-ui-components/react/switch'
import type { SwitchRoot } from 'node_modules/@base-ui-components/react/esm/switch/root/SwitchRoot'
import styles from './switch.module.css'

export function Switch({
  onCheckedChange,
  checked,
  className = '',
  ...rest
}: SwitchRoot.Props) {
  return (
    <BaseSwitch.Root
      {...rest}
      checked={checked}
      className={`${styles.switch} ${className}`}
      id="ascents-training-switch"
      onCheckedChange={onCheckedChange}
    >
      <BaseSwitch.Thumb className={styles.thumb} />
    </BaseSwitch.Root>
  )
}
