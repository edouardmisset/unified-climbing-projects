'use client'

import { Popover as BasePopover } from '@base-ui/react/popover'
import { type CSSProperties, memo, type ReactNode } from 'react'
import { PopoverContent } from './popover-content'
import styles from './popover.module.css'

type PopoverProps = {
  trigger: ReactNode
  title: ReactNode
  description: ReactNode
  triggerClassName?: string
  buttonStyle?: CSSProperties
  triggerTitle?: string
}

export const Popover = memo(
  ({
    trigger,
    title,
    description,
    triggerClassName = '',
    buttonStyle,
    triggerTitle,
  }: PopoverProps) => {
    if (trigger == null || title == null || description == null) return null

    const triggerClass = `${styles.iconButton} ${triggerClassName}`
    return (
      <BasePopover.Root>
        <BasePopover.Trigger className={triggerClass} style={buttonStyle} title={triggerTitle}>
          {trigger}
        </BasePopover.Trigger>
        <BasePopover.Portal>
          <PopoverContent description={description} title={title} />
        </BasePopover.Portal>
      </BasePopover.Root>
    )
  },
)
