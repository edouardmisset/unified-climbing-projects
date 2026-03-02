'use client'

import { Popover as BasePopover } from '@base-ui/react/popover'
import { type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Arrow } from '../../svg/arrow/arrow'
import styles from './popover.module.css'

type PopoverProps = {
  trigger: ReactNode
  title: ReactNode
  description: ReactNode
  triggerClassName?: string
  buttonStyle?: CSSProperties
  triggerTitle?: string
} & Omit<
  ComponentPropsWithoutRef<typeof BasePopover.Trigger>,
  'children' | 'className' | 'style' | 'title'
>

export function Popover(props: PopoverProps) {
  const {
    trigger,
    title,
    description,
    triggerClassName = '',
    buttonStyle,
    triggerTitle,
    ...triggerProps
  } = props

  if (trigger == null || title == null || description == null) return null

  const triggerClass = `${styles.iconButton} ${triggerClassName}`

  return (
    <BasePopover.Root>
      <BasePopover.Trigger
        {...triggerProps}
        className={triggerClass}
        style={buttonStyle}
        title={triggerTitle}
      >
        {trigger}
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner sideOffset={8}>
          <BasePopover.Popup className={styles.popup}>
            <BasePopover.Arrow className={styles.arrow}>
              <Arrow />
            </BasePopover.Arrow>
            <BasePopover.Title className={styles.title}>{title}</BasePopover.Title>
            <BasePopover.Description
              className={styles.description}
              render={<div>{description}</div>}
            />
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  )
}
