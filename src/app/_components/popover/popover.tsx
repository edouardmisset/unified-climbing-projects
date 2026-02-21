'use client'

import { Popover as BasePopover } from '@base-ui/react/popover'
import { type CSSProperties, memo, type ReactNode } from 'react'
import { PopoverContent } from './popover-content'
import styles from './popover.module.css'

export const Popover = memo(
  ({
    triggerContent,
    popoverTitle,
    popoverDescription,
    triggerClassName = '',
    buttonStyle,
    title,
  }: {
    triggerContent: ReactNode
    triggerClassName?: string
    buttonStyle?: CSSProperties
    popoverTitle: ReactNode
    popoverDescription: ReactNode
    title?: string
  }) => {
    const triggerClass = `${styles.iconButton} ${triggerClassName}`
    return (
      <BasePopover.Root>
        <BasePopover.Trigger className={triggerClass} style={buttonStyle} title={title}>
          {triggerContent}
        </BasePopover.Trigger>
        <BasePopover.Portal>
          <PopoverContent popoverDescription={popoverDescription} popoverTitle={popoverTitle} />
        </BasePopover.Portal>
      </BasePopover.Root>
    )
  },
)
