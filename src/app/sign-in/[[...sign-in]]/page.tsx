import { SignIn } from '@clerk/nextjs'
import { PublicPageShell } from '~/app/_components/public-page-shell/public-page-shell'

export default function SignInPage() {
  return (
    <PublicPageShell layout='auth'>
      <SignIn fallbackRedirectUrl='/wrap-up' signUpUrl='/sign-up' />
    </PublicPageShell>
  )
}
