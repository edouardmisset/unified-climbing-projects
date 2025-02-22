import { Dialog } from '@base-ui-components/react/dialog'
import type { ReactNode } from 'react'
import styles from './code-dialog.module.css'

export default function CodeDialog({
  title,
  content,
}: { title: string; content: ReactNode }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className={styles.Button}>{title}</Dialog.Trigger>
      <Dialog.Portal keepMounted>
        <Dialog.Backdrop className={styles.Backdrop} />
        <Dialog.Popup className={styles.Popup}>
          <Dialog.Title className={styles.Title}>{title}</Dialog.Title>
          <Dialog.Description className={styles.Description}>
            {content}
          </Dialog.Description>
          <div className={styles.Actions}>
            <Dialog.Close className={styles.Button}>Close</Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
