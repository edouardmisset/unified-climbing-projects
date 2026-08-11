'use client'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import baseUiStyles from '../base-ui/base-ui-primitives.module.css'
import styles from './dialog.module.css'

type DialogProps = {
  triggerText?: ReactNode
  content: ReactNode
  triggerClassName?: string
  title?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Dialog({
  triggerText,
  content,
  triggerClassName,
  title,
  open,
  onOpenChange,
}: DialogProps) {
  return (
    <BaseDialog.Root onOpenChange={onOpenChange} open={open}>
      {triggerText === undefined ? undefined : (
        <BaseDialog.Trigger className={triggerClassName}>{triggerText}</BaseDialog.Trigger>
      )}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={`${baseUiStyles.overlayBackdrop} ${styles.backdrop}`} />
        <BaseDialog.Popup className={styles.popup}>
          <BaseDialog.Title className={styles.title}>{title}</BaseDialog.Title>
          <BaseDialog.Description render={<div>{content}</div>} />
          <BaseDialog.Close
            aria-label='Close dialog'
            className={`${baseUiStyles.interactiveControl} ${styles.button}`}
            data-close='true'
          >
            <XIcon />
          </BaseDialog.Close>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
