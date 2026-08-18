import { KeycapButton } from '~/app/_components/ui/keycap-button/keycap-button'
import styles from './log-wizard.module.css'

export function SendButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <div className={styles.submitAction}>
      <KeycapButton
        disabled={isSubmitting}
        label={isSubmitting ? 'Sending…' : 'Send'}
        type='submit'
      />
    </div>
  )
}
