import { Switch } from '@base-ui-components/react/switch'
import { memo } from 'react'
import styles from './ascents-training-switch.module.css'

export const AscentsTrainingSwitch = memo(
  ({ toggle, isTraining }: { toggle: () => void; isTraining: boolean }) => (
    <div className={styles.Container}>
      <label htmlFor="ascents-training-switch">Ascent</label>
      <Switch.Root
        checked={isTraining}
        className={styles.Switch}
        id="ascents-training-switch"
        onCheckedChange={toggle}
      >
        <Switch.Thumb className={styles.Thumb} />
      </Switch.Root>
      <span>Training</span>
    </div>
  ),
)
