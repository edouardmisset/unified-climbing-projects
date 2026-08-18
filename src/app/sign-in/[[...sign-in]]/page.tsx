import { SignIn } from '~/app/_components/sign-in/sign-in'
import { PublicPageShell } from '~/app/_components/public-page-shell/public-page-shell'

export default function SignInPage() {
  return (
    <PublicPageShell layout='auth'>
      <SignIn fallbackRedirectUrl='/ascents/home' signUpUrl='/sign-up' />
    </PublicPageShell>
  )
}
