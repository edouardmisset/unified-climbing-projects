import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/nextjs'

export function UserStatus() {
  const { user } = useUser()
  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton /> {user?.fullName}
      </SignedIn>
    </>
  )
}
