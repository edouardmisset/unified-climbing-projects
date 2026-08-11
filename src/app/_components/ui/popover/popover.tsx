'use client'

import { useId, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react'
import baseUiStyles from '../base-ui/base-ui-primitives.module.css'
import styles from './popover.module.css'

const pointerFallbackStyles = `
  [data-popover-container] {
    container-type: anchored;
  }

  @container popover anchored(fallback: --popover-above) {
    [data-popover-arrow] {
      inset-block-start: auto;
      inset-block-end: -8px;
      clip-path: polygon(0 0, 100% 0, 50% 100%);
      filter: drop-shadow(0 1px light-dark(var(--gray-2), var(--gray-7)));
    }
  }
`

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
  const anchorName = `--${popupId}`
  const anchorStyle = { '--popover-anchor': anchorName } as CSSProperties
  const interestProps = showOnInterest ? { interestfor: hintId } : {}

  if (trigger === undefined || popoverTitle === undefined || children === undefined) return

  const triggerClass = `${baseUiStyles.interactiveControl} ${styles.iconButton}${typeof className === 'string' ? ` ${className}` : ''}`

  return (
    <>
      <style>{pointerFallbackStyles}</style>
      <button
        {...triggerProps}
        {...interestProps}
        className={triggerClass}
        popoverTarget={popupId}
        style={{ ...triggerProps.style, ...anchorStyle }}
        type='button'
      >
        {trigger}
      </button>
      <div
        aria-labelledby={titleId}
        className={`${baseUiStyles.popupSurface} ${styles.popup}`}
        data-popover-container
        id={popupId}
        popover='auto'
        style={anchorStyle}
      >
        <span aria-hidden='true' className={styles.arrow} data-popover-arrow />
        <h2 className={styles.title} id={titleId}>
          {popoverTitle}
        </h2>
        <div className={styles.description}>{children}</div>
      </div>
      {showOnInterest && (
        <div
          aria-hidden='true'
          className={`${baseUiStyles.popupSurface} ${styles.popup} ${styles.hint}`}
          data-popover-container
          id={hintId}
          popover='hint'
          style={anchorStyle}
        >
          <span aria-hidden='true' className={styles.arrow} data-popover-arrow />
          <h2 className={styles.title}>{popoverTitle}</h2>
          <div className={styles.description}>{children}</div>
        </div>
      )}
    </>
  )
}
