import { Drawer } from '@base-ui/react/drawer'
import baseUiStyles from '../../ui/base-ui/base-ui-primitives.module.css'
import styles from './mobile-navigation-trigger.module.css'

type MobileNavigationTriggerProps = {
  open: boolean
}

export function MobileNavigationTrigger({ open }: MobileNavigationTriggerProps) {
  return (
    <Drawer.Trigger
      aria-expanded={open}
      aria-label='Open navigation drawer'
      className={`${baseUiStyles.interactiveControl} ${baseUiStyles.neutralControlSurface} ${styles.mobileTrigger}`}
    >
      <span aria-hidden className={`${styles.mobileTriggerBar} ${styles.mobileTriggerBarTop}`} />
      <span
        aria-hidden
        className={`${styles.mobileTriggerBar} ${styles.mobileTriggerBarMiddleForward}`}
      />
      <span
        aria-hidden
        className={`${styles.mobileTriggerBar} ${styles.mobileTriggerBarMiddleBackward}`}
      />
      <span aria-hidden className={`${styles.mobileTriggerBar} ${styles.mobileTriggerBarBottom}`} />
    </Drawer.Trigger>
  )
}
