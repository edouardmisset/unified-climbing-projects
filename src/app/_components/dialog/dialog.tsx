import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import styles from './dialog.module.css'

export default function Dialog({
  title,
  content,
}: { title: string; content: React.JSX.Element }) {
  return (
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
            <BaseDialog.Close className={styles.Button}>Close</BaseDialog.Close>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
