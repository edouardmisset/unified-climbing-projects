import { SignInButton as SignIn } from '@clerk/nextjs'
import styles from './sign-in-button.module.css'

export function SignInButton() {
  return (
    <div className={styles.SignInButton}>
      <SignIn mode="modal" />
    </div>
  )
}
