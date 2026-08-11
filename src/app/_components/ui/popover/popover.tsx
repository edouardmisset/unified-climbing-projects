'use client'

import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import baseUiStyles from '../base-ui/base-ui-primitives.module.css'
import styles from './popover.module.css'

type PopoverProps = {
  trigger: ReactNode
  popoverTitle: ReactNode
  children: ReactNode
  showOnInterest?: boolean
} & Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'type'>

export function Popover(props: PopoverProps) {
  const {
    trigger,
    popoverTitle,
    children,
    className = '',
    showOnInterest = false,
    ...triggerProps
  } = props
  const id = useId().replaceAll(':', '')
  const popupId = `popover-${id}`
  const titleId = `${popupId}-title`
  const hintId = `${popupId}-hint`
  const interestProps = showOnInterest ? { interestfor: hintId } : {}

  if (trigger === undefined || popoverTitle === undefined || children === undefined) return

  const triggerClass = `${baseUiStyles.interactiveControl} ${baseUiStyles.centeredControl} ${styles.iconButton}${typeof className === 'string' ? ` ${className}` : ''}`

  return (
    <>
      <button
        {...triggerProps}
        {...interestProps}
        className={triggerClass}
        popoverTarget={popupId}
        type='button'
      >
        {trigger}
      </button>
      <div
        aria-labelledby={titleId}
        className={`${baseUiStyles.popupSurface} ${styles.popup}`}
        id={popupId}
        popover='auto'
      >
        <h2 className={styles.title} id={titleId}>
          {popoverTitle}
        </h2>
        <div className={styles.description}>{children}</div>
      </div>
      {showOnInterest && (
        <div
          aria-hidden='true'
          className={`${baseUiStyles.popupSurface} ${styles.popup} ${styles.hint}`}
          id={hintId}
          popover='hint'
        >
          <h2 className={styles.title}>{popoverTitle}</h2>
          <div className={styles.description}>{children}</div>
        </div>
      )}
    </>
  )
}
