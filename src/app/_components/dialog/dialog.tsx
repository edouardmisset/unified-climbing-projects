import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import { XIcon } from 'lucide-react'
import styles from './dialog.module.css'

export function Dialog({
  triggerText,
  content,
  triggerClassName,
  title,
}: {
  triggerText?: string
  content: React.JSX.Element
  triggerClassName?: string
  title?: string
}) {
  return (
    <BaseDialog.Root>
      <BaseDialog.Trigger className={`${styles.trigger} ${triggerClassName}`}>
        {triggerText}
      </BaseDialog.Trigger>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Popup className={styles.popup}>
          <BaseDialog.Title className={styles.title}>{title}</BaseDialog.Title>
          <BaseDialog.Description render={content} />
          <BaseDialog.Close className={styles.button} data-close='true'>
            <XIcon />
          </BaseDialog.Close>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}

// oxlint-disable-next-line react/no-multi-comp
export function ControlledDialog({
  open,
  onOpenChange,
  content,
  title,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: React.JSX.Element
  title?: string
}) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Popup className={styles.popup}>
          <BaseDialog.Title className={styles.title}>{title}</BaseDialog.Title>
          <BaseDialog.Description render={content} />
          <BaseDialog.Close className={styles.button} data-close='true'>
            <XIcon />
          </BaseDialog.Close>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
