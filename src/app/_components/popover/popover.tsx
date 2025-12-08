'use client'

import { Popover as BasePopover } from '@base-ui-components/react/popover'
import { type CSSProperties, memo, type ReactNode, useMemo } from 'react'
import { Arrow } from '../svg/arrow/arrow'
import styles from './popover.module.css'

const PopoverContent = memo(
  ({
    popoverTitle,
    popoverDescription,
  }: {
    popoverTitle: ReactNode
    popoverDescription: ReactNode
  }) => (
    <BasePopover.Positioner sideOffset={8}>
      <BasePopover.Popup className={styles.popup}>
        <BasePopover.Arrow className={styles.arrow}>
          <Arrow />
        </BasePopover.Arrow>
        <BasePopover.Title className={styles.title}>
          {popoverTitle}
        </BasePopover.Title>
        <BasePopover.Description
          className={styles.description}
          render={<div>{popoverDescription}</div>}
        />
      </BasePopover.Popup>
    </BasePopover.Positioner>
  ),
)

export const Popover = memo(
  ({
    triggerContent,
    popoverTitle,
    popoverDescription,
    triggerClassName = '',
    buttonStyle,
  }: {
    triggerContent: ReactNode
    triggerClassName?: string
    buttonStyle?: CSSProperties
    popoverTitle: ReactNode
    popoverDescription: ReactNode
  }) => {
    const triggerClass = useMemo(
      () => `${styles.iconButton} ${triggerClassName}`,
      [triggerClassName],
    )
    return (
      <BasePopover.Root>
        <BasePopover.Trigger className={triggerClass} style={buttonStyle}>
          {triggerContent}
        </BasePopover.Trigger>
        <BasePopover.Portal>
          <PopoverContent
            popoverDescription={popoverDescription}
            popoverTitle={popoverTitle}
          />
        </BasePopover.Portal>
      </BasePopover.Root>
    )
  },
)
