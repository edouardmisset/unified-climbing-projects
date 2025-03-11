import { Switch } from '@base-ui-components/react/switch'
import { memo } from 'react'
import styles from './ascents-training-switch.module.css'

function AscentsTrainingSwitch({
  toggle,
  isTraining,
}: {
  toggle: () => void
  isTraining: boolean
}) {
  return (
    <div className={styles.Container}>
      <label htmlFor="ascents-training-switch">Ascent</label>
      <Switch.Root
        className={styles.Switch}
        onCheckedChange={toggle}
        id="ascents-training-switch"
        checked={isTraining}
      >
        <Switch.Thumb className={styles.Thumb} />
      </Switch.Root>
      <span>Training</span>
    </div>
  )
}

export default memo(AscentsTrainingSwitch)
