import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import { memo } from 'react'
import styles from './dialog.module.css'

export const Dialog = memo(
  ({ title, content }: { title: string; content: React.JSX.Element }) => (
    <BaseDialog.Root>
      <BaseDialog.Trigger className={styles.button}>{title}</BaseDialog.Trigger>
      <BaseDialog.Portal keepMounted>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Popup className={styles.popup}>
          <BaseDialog.Title className={styles.title}>{title}</BaseDialog.Title>
          <BaseDialog.Description render={content} />
          <div className={styles.actions}>
            <BaseDialog.Close className={styles.button} data-close="true">
              Close
            </BaseDialog.Close>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  ),
)
