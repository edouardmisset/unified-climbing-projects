'use client'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'
import type { ReactNode } from 'react'
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
  const triggerClass = `${styles.trigger}${triggerClassName ? ` ${triggerClassName}` : ''}`

  return (
    <BaseDialog.Root onOpenChange={onOpenChange} open={open}>
      {triggerText ? (
        <BaseDialog.Trigger className={triggerClass}>{triggerText}</BaseDialog.Trigger>
      ) : undefined}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Popup className={styles.popup}>
          <BaseDialog.Title className={styles.title}>{title}</BaseDialog.Title>
          <BaseDialog.Description>{content}</BaseDialog.Description>
          <BaseDialog.Close className={styles.button} data-close='true' aria-label='Close dialog'>
            <XIcon />
          </BaseDialog.Close>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
