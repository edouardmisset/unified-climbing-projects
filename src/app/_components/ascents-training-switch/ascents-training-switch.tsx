import { memo } from 'react'
import { Switch } from '../switch/switch'
import styles from './ascents-training-switch.module.css'

export const AscentsTrainingSwitch = memo(
  ({ toggle, isTraining }: { toggle: () => void; isTraining: boolean }) => (
    <label className={styles.container} htmlFor="ascents-training-switch">
      <span className={styles.option} data-is-selected={!isTraining}>
        Ascent
      </span>
      <Switch
        checked={isTraining}
        id="ascents-training-switch"
        onCheckedChange={toggle}
      />
      <span className={styles.option} data-is-selected={isTraining}>
        Training
      </span>
    </label>
  ),
)
