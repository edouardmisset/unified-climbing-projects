import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return <SignUp fallbackRedirectUrl="/wrap-up" signInUrl="/sign-in" />
}
