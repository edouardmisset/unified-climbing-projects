import { Popover as BasePopover } from '@base-ui-components/react/popover'
import { type CSSProperties, type ReactNode, memo } from 'react'
import { ArrowSvg } from '../arrow-svg/arrow-svg'
import styles from './popover.module.css'

function Popover({
  triggerContent,
  popoverTitle,
  popoverDescription,
  triggerClassName = '',
  buttonStyle = {},
}: {
  triggerContent: ReactNode
  triggerClassName?: string
  buttonStyle?: CSSProperties
  popoverTitle: ReactNode
  popoverDescription: ReactNode
}) {
  return (
    <BasePopover.Root>
      <BasePopover.Trigger
        className={`${styles.IconButton} ${triggerClassName}`}
        style={buttonStyle}
      >
        {triggerContent}
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner sideOffset={8}>
          <BasePopover.Popup className={styles.Popup}>
            <BasePopover.Arrow className={styles.Arrow}>
              <ArrowSvg />
            </BasePopover.Arrow>
            <BasePopover.Title className={styles.Title}>
              {popoverTitle}
            </BasePopover.Title>
            <BasePopover.Description className={styles.Description}>
              {popoverDescription}
            </BasePopover.Description>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  )
}

export default memo(Popover)
