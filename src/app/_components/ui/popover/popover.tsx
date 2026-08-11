'use client'

import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Arrow } from '../../svg/arrow/arrow'
import baseUiStyles from '../base-ui/base-ui-primitives.module.css'
import styles from './popover.module.css'

type PopoverProps = {
  trigger: ReactNode
  popoverTitle: ReactNode
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'type'>

export function Popover(props: PopoverProps) {
  const { trigger, popoverTitle, children, className = '', ...triggerProps } = props
  const id = useId().replaceAll(':', '')
  const popupId = `popover-${id}`
  const titleId = `${popupId}-title`

  if (trigger === undefined || popoverTitle === undefined || children === undefined) return

  const triggerClass = `${baseUiStyles.interactiveControl} ${styles.iconButton}${typeof className === 'string' ? ` ${className}` : ''}`

  return (
    <>
      <button {...triggerProps} className={triggerClass} popoverTarget={popupId} type='button'>
        {trigger}
      </button>
      <div
        aria-labelledby={titleId}
        className={`${baseUiStyles.popupSurface} ${styles.popup}`}
        id={popupId}
        popover='auto'
      >
        <div className={styles.arrow}>
          <Arrow />
        </div>
        <h2 className={styles.title} id={titleId}>
          {popoverTitle}
        </h2>
        <div className={styles.description}>{children}</div>
      </div>
    </>
  )
}
