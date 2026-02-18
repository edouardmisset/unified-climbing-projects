import { Popover as BasePopover } from '@base-ui-components/react/popover'
import { memo, type ReactNode } from 'react'
import { Arrow } from '../svg/arrow/arrow'
import styles from './popover.module.css'

type PopoverContentProps = {
  popoverTitle: ReactNode
  popoverDescription: ReactNode
}

function PopoverContentComponent(props: PopoverContentProps) {
  const { popoverTitle, popoverDescription } = props

  return (
    <BasePopover.Positioner sideOffset={8}>
      <BasePopover.Popup className={styles.popup}>
        <BasePopover.Arrow className={styles.arrow}>
          <Arrow />
        </BasePopover.Arrow>
        <BasePopover.Title className={styles.title}>{popoverTitle}</BasePopover.Title>
        <BasePopover.Description
          className={styles.description}
          render={<div>{popoverDescription}</div>}
        />
      </BasePopover.Popup>
    </BasePopover.Positioner>
  )
}

export const PopoverContent = memo(PopoverContentComponent)
