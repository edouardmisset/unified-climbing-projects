import { Popover as BasePopover } from '@base-ui-components/react/popover'
import { type CSSProperties, type ReactNode, memo, useMemo } from 'react'
import { Arrow } from '../svg/arrow/arrow'
import styles from './popover.module.css'

const PopoverContent = memo(
  ({
    popoverTitle,
    popoverDescription,
  }: {
    popoverTitle: ReactNode
    popoverDescription: ReactNode
  }) => {
    return (
      <BasePopover.Positioner sideOffset={8}>
        <BasePopover.Popup className={styles.Popup}>
          <BasePopover.Arrow className={styles.Arrow}>
            <Arrow />
          </BasePopover.Arrow>
          <BasePopover.Title className={styles.Title}>
            {popoverTitle}
          </BasePopover.Title>
          <BasePopover.Description
            className={styles.Description}
            render={<div>{popoverDescription}</div>}
          />
        </BasePopover.Popup>
      </BasePopover.Positioner>
    )
  },
)

export const Popover = memo(
  ({
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
  }) => {
    const triggerClass = useMemo(
      () => `${styles.IconButton} ${triggerClassName}`,
      [triggerClassName],
    )
    return (
      <BasePopover.Root>
        <BasePopover.Trigger className={triggerClass} style={buttonStyle}>
          {triggerContent}
        </BasePopover.Trigger>
        <BasePopover.Portal>
          <PopoverContent
            popoverTitle={popoverTitle}
            popoverDescription={popoverDescription}
          />
        </BasePopover.Portal>
      </BasePopover.Root>
    )
  },
)
