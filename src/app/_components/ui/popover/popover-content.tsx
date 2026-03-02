'use client'
import { Popover as BasePopover } from '@base-ui/react/popover'
import { memo, type ReactNode } from 'react'
import { Arrow } from '../../svg/arrow/arrow'
import styles from './popover.module.css'

type PopoverContentProps = {
  title: ReactNode
  description: ReactNode
}

function PopoverContentComponent(props: PopoverContentProps) {
  const { title, description } = props

  return (
    <BasePopover.Positioner sideOffset={8}>
      <BasePopover.Popup className={styles.popup}>
        <BasePopover.Arrow className={styles.arrow}>
          <Arrow />
        </BasePopover.Arrow>
        <BasePopover.Title className={styles.title}>{title}</BasePopover.Title>
        <BasePopover.Description className={styles.description} render={<div>{description}</div>} />
      </BasePopover.Popup>
    </BasePopover.Positioner>
  )
}

export const PopoverContent = memo(PopoverContentComponent)
