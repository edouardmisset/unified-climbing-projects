import { SignUp } from '@clerk/nextjs'
import { PublicPageShell } from '~/app/_components/public-page-shell/public-page-shell'

export default function SignUpPage() {
  return (
    <PublicPageShell layout="auth">
      <SignUp fallbackRedirectUrl="/wrap-up" signInUrl="/sign-in" />
    </PublicPageShell>
  )
}
