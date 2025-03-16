import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import { memo } from 'react'
import styles from './dialog.module.css'

export const Dialog = memo(
  ({ title, content }: { title: string; content: React.JSX.Element }) => (
    <BaseDialog.Root>
      <BaseDialog.Trigger className={styles.Button}>{title}</BaseDialog.Trigger>
      <BaseDialog.Portal keepMounted>
        <BaseDialog.Backdrop className={styles.Backdrop} />
        <BaseDialog.Popup className={styles.Popup}>
          <BaseDialog.Title className={styles.Title}>{title}</BaseDialog.Title>
          <BaseDialog.Description
            className={styles.Description}
            render={content}
          />
          <div className={styles.Actions}>
            <BaseDialog.Close className={styles.Button} data-close="true">
              Close
            </BaseDialog.Close>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  ),
)
