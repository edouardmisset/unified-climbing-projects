'use client'

import { Popover as BasePopover } from '@base-ui/react/popover'
import { type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Arrow } from '../../svg/arrow/arrow'
import baseUiStyles from '../base-ui/base-ui-primitives.module.css'
import styles from './popover.module.css'

type PopoverProps = {
  trigger: ReactNode
  popoverTitle: ReactNode
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<typeof BasePopover.Trigger>, 'children'>

export function Popover(props: PopoverProps) {
  const { trigger, popoverTitle, children, className = '', ...triggerProps } = props

  if (trigger == null || popoverTitle == null || children == null) return null

  const triggerClass = `${baseUiStyles.interactiveControl} ${styles.iconButton}${className ? ` ${className}` : ''}`

  return (
    <BasePopover.Root>
      <BasePopover.Trigger {...triggerProps} className={triggerClass}>
        {trigger}
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner sideOffset={8}>
          <BasePopover.Popup className={`${baseUiStyles.popupSurface} ${styles.popup}`}>
            <BasePopover.Arrow className={baseUiStyles.popupArrow}>
              <Arrow />
            </BasePopover.Arrow>
            <BasePopover.Title className={styles.title}>{popoverTitle}</BasePopover.Title>
            <BasePopover.Description
              className={styles.description}
              render={<div>{children}</div>}
            />
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  )
}
