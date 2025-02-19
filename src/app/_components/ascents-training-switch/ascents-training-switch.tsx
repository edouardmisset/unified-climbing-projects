import { Switch } from '@base-ui-components/react/switch'
import styles from './ascents-training-switch.module.css'

export function AscentsTrainingSwitch({
  toggle,
}: {
  toggle: () => void
}) {
  return (
    <div className={styles.Container}>
      <label htmlFor="ascents-training-switch">Show Training</label>
      <Switch.Root
        className={styles.Switch}
        onCheckedChange={toggle}
        id="ascents-training-switch"
      >
        <Switch.Thumb className={styles.Thumb} />
      </Switch.Root>
    </div>
  )
}
