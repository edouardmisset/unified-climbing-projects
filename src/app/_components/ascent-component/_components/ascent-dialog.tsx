import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import { XIcon } from 'lucide-react'
import styles from '~/app/_components/dialog/dialog.module.css'
import localStyles from './ascent-dialog.module.css'

export default function AscentDialog({
  triggerText,
  content,
  triggerClassName,
}: {
  triggerText: string
  content: React.JSX.Element
  triggerClassName?: string
}) {
  return (
    <BaseDialog.Root>
      <BaseDialog.Trigger className={`${styles.Button} ${triggerClassName}`}>
        {triggerText}
      </BaseDialog.Trigger>
      <BaseDialog.Portal keepMounted>
        <BaseDialog.Backdrop className={styles.Backdrop} />
        <BaseDialog.Popup className={localStyles.Popup}>
          <BaseDialog.Description render={content} />
          <BaseDialog.Close
            className={`${styles.Button} ${localStyles.Button}`}
            data-close="true"
          >
            <XIcon />
          </BaseDialog.Close>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
