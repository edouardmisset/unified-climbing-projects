import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return <SignIn fallbackRedirectUrl="/wrap-up" signUpUrl="/sign-up" />
}
